// src/common/gateways/base.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  namespace: '/', // Explicitly set default namespace
  //   cors: {
  //     origin: process.env.FRONTEND_URL || '*',
  //   },
  cors: {
    origin: '*',
    credentials: true,
  },
  transports: ['websocket', 'polling'], // Match client transports
})
export abstract class BaseGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  protected readonly logger = new Logger(BaseGateway.name);

  @WebSocketServer()
  protected server: Server;

  constructor(
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      this.logger.log(`Client attempting to connect: ${client.id}`);

      // Get token from auth object
      const token = client.handshake.auth.token;

      if (!token) {
        this.logger.error('No authentication token provided');
        throw new WsException('No authentication token provided');
      }

      this.logger.log('Verifying token...');

      // Verify the access token
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Attach user info to socket
      client.data.user = payload;

      this.logger.log(
        `✅ Client connected: ${client.id} (User: ${payload.sub})`,
      );
    } catch (error) {
      this.logger.error(`❌ Connection failed: ${error.message}`);
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.user?.sub || 'unknown';
    this.logger.log(`Client disconnected: ${client.id} (User: ${userId})`);
  }

  protected emitToAll(event: string, data?: any) {
    this.server.emit(event, data);
  }

  protected emitToRoom(room: string, event: string, data?: any) {
    this.server.to(room).emit(event, data);
  }
}

// // src/common/gateways/base.gateway.ts
// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   WsException,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { Logger } from '@nestjs/common';
// import { AuthService } from 'src/auth/providers/auth.service';

// @WebSocketGateway({
//   //   cors: {
//   //     origin: process.env.FRONTEND_URL || '*',
//   //   },
//   cors: {
//     origin: '*',
//   },
// })
// export abstract class BaseGateway
//   implements OnGatewayConnection, OnGatewayDisconnect
// {
//   protected readonly logger = new Logger(BaseGateway.name);

//   @WebSocketServer()
//   protected server: Server;

//   constructor(protected readonly authService: AuthService) {}

//   async handleConnection(client: Socket) {
//     try {
//       const token = client.handshake.auth.authRefreshToken;

//       if (!token) {
//         throw new WsException('No authentication token provided');
//       }

//       await this.authService.verifyWebsocketToken(token);

//       this.logger.log(`Client connected: ${client.id}`);
//     } catch (error) {
//       this.logger.error(`Connection failed: ${error.message}`);
//       client.disconnect();
//       throw new WsException('Unauthorized');
//     }
//   }

//   handleDisconnect(client: Socket) {
//     this.logger.log(`Client disconnected: ${client.id}`);
//   }

//   // Emit helper methods
//   protected emitToAll(event: string, data?: any) {
//     this.server.emit(event, data);
//   }

//   protected emitToRoom(room: string, event: string, data?: any) {
//     this.server.to(room).emit(event, data);
//   }
// }
