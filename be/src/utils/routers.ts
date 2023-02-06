import { Router } from 'express';

export abstract class PathRouter {
  constructor(readonly path: string, readonly router: Router) {}
}