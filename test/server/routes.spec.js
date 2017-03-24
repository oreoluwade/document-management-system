import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

describe('NAVIGATING TO THE INDEX ROUTE', () => {
  it('should successfully route the user to the default home route', (done) => {
    request.get('/').expect(200, done);
  });
});
