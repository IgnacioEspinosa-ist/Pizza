import { of } from 'rxjs';

export class ActivatedRouteMock {
  params = of({ id: 123 });  // Simulamos que el parámetro 'id' tiene el valor 123
  snapshot = { paramMap: { get: (key: string) => key === 'id' ? '123' : null } };  // Mock de snapshot para obtener el parámetro 'id'
}
