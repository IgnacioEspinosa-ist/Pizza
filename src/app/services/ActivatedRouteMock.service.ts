import { of } from 'rxjs';

export class ActivatedRouteMock {
  params = of({ id: 123 });  
  snapshot = { paramMap: { get: (key: string) => key === 'id' ? '123' : null } };  
}
