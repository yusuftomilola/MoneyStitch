// src/users/providers/users.gateway.ts
import { Injectable } from '@nestjs/common';
import { BaseGateway } from 'src/common/gateways/base.gateway';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';

export enum UserEvents {
  USER_CREATED = 'user:created',
  USER_UPDATED = 'user:updated',
  USER_DELETED = 'user:deleted',
  USERS_LIST_CHANGED = 'users:list-changed',
}

@Injectable()
export class UsersGateway extends BaseGateway {
  constructor(
    jwtService: JwtService,
    configService: ConfigService, // Add this
  ) {
    super(jwtService, configService); // Pass both to parent
  }

  emitUserCreated(user: Partial<User>) {
    this.emitToAll(UserEvents.USER_CREATED, { user });
    this.emitToAll(UserEvents.USERS_LIST_CHANGED, { action: 'created' });
  }

  emitUserUpdated(user: Partial<User>) {
    this.emitToAll(UserEvents.USER_UPDATED, { user });
    this.emitToAll(UserEvents.USERS_LIST_CHANGED, { action: 'updated' });
  }

  emitUserDeleted(userId: string) {
    this.emitToAll(UserEvents.USER_DELETED, { userId });
    this.emitToAll(UserEvents.USERS_LIST_CHANGED, { action: 'deleted' });
  }
}

// // src/users/providers/users.gateway.ts
// import { forwardRef, Inject, Injectable } from '@nestjs/common';
// import { BaseGateway } from 'src/common/gateways/base.gateway';
// import { AuthService } from 'src/auth/providers/auth.service';
// import { User } from '../entities/user.entity';

// export enum UserEvents {
//   USER_CREATED = 'user:created',
//   USER_UPDATED = 'user:updated',
//   USER_DELETED = 'user:deleted',
//   USERS_LIST_CHANGED = 'users:list-changed',
// }

// @Injectable()
// export class UsersGateway extends BaseGateway {
//   constructor(
//     @Inject(forwardRef(() => AuthService))
//     authService: AuthService,
//   ) {
//     super(authService);
//   }

//   emitUserCreated(user?: Partial<User>) {
//     this.emitToAll(UserEvents.USER_CREATED, { user });
//     this.emitToAll(UserEvents.USERS_LIST_CHANGED, { action: 'created' });
//   }

//   emitUserUpdated(user?: Partial<User>) {
//     this.emitToAll(UserEvents.USER_UPDATED, { user });
//     this.emitToAll(UserEvents.USERS_LIST_CHANGED, { action: 'updated' });
//   }

//   emitUserDeleted(userId?: string) {
//     this.emitToAll(UserEvents.USER_DELETED, { userId });
//     this.emitToAll(UserEvents.USERS_LIST_CHANGED, { action: 'deleted' });
//   }
// }
