import { Injectable } from '@nestjs/common';
import { DBEvent } from '../../domain';
import { getAppResourceKeyByTableName } from '../app/modules/app-resources';
import { MessageBrokerContainerService } from './message-broker-container.service';

@Injectable()
export class MessageBrokerService {
  constructor(
    //

    private messageBrokerContainerService: MessageBrokerContainerService,
  ) {}

  async publishDbEvent(dbEvent: DBEvent) {
    try {
      const broker = await this.messageBrokerContainerService.getBroker();

      const action = dbEvent.action;
      const resource = getAppResourceKeyByTableName(dbEvent.tableName);

      const dbEventData = {
        ...dbEvent,
      };

      await broker
        .publish('db_event', dbEventData, {
          routingKey: `${resource}.${action}`,
          options: {
            messageId: dbEvent.id,
          },
        })
        .then(
          (ps) =>
            new Promise<void>((resolve, reject) => {
              ps.on('error', (err, messageId) => {
                if (messageId === dbEvent.id) {
                  reject(err);
                }
              });

              ps.on('success', (messageId) => {
                if (messageId === dbEvent.id) {
                  resolve();
                }
              });
            }),
        );

      return true;
    } catch (e) {
      console.error(e);
    }

    return false;
  }
}
