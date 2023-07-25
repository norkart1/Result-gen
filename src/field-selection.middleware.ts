// field-selection.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { GraphQLResolveInfo } from 'graphql';
import  * as graphqlFields from 'graphql-fields';

@Injectable()
export class FieldSelectionMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: Function) {
        // const info = req['graphqlInfo'] as GraphQLResolveInfo;
        // const requestedFields = graphqlFields(info);
        req['requestedFields'] = req;
        next();
      }
}
