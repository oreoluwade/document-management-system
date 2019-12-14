import supertest from 'supertest';
import app from '../../app';
import models from '../../models';
import MockedResources from '../mockedResources';

const request = supertest(app);

const { Role, User } = models;

const firstRole = MockedResources.createAdminRole();
const regularUser = MockedResources.createUser();

describe('USER CONTROLLER', () => {
  let user;
  let token;

  beforeAll(async () => {
    const role = await Role.create(firstRole);
    regularUser.roleId = role.id;
  });

  afterEach(() => User.destroy({ where: {} }));

  afterAll(() => models.sequelize.sync({ force: true }));

  beforeEach(async done => {
    const response = await request.post('/api/user').send(regularUser);
    user = response.body;
    token = response.body.token;
    done();
  });

  describe('Create User', () => {
    it('Should ensure unique constraints when creating users', async done => {
      const response = await request.post('/api/user').send(regularUser);
      expect(response.status).toBe(409);
      expect(response.body.error).toEqual('User already exists!');
      done();
    });

    describe('Get Users', () => {
      it('Should allow admin user get users', async done => {
        const response = await request
          .get('/api/user')
          .set({ Authorization: token });
        expect(response.status).toEqual(200);
        expect(response.body.length).toBeGreaterThan(0);
        done();
      });
    });

    describe('Get one user', () => {
      it('Should not return the user if the user ID does not exist', async done => {
        const response = await request
          .get('/api/user/666')
          .set({ Authorization: token });
        expect(response.status).toEqual(404);
        done();
      });
      it('Should return the user that owns the supplied id', async done => {
        const response = await request
          .get(`/api/user/${user.id}`)
          .set({ Authorization: token });
        expect(response.status).toEqual(200);
        expect(user.email).toEqual(regularUser.email);
        done();
      });
    });

    describe('Update User', () => {
      it('Should not allow the update of a nonexistent user', async done => {
        const response = await request
          .get('/api/user/666')
          .set({ Authorization: token });
        expect(response.status).toEqual(404);
        expect(response.body.error).toEqual('User does not exist');
        done();
      });
      it('Should update a user if the provided ID is valid', async done => {
        const fieldToUpdate = {
          username: 'nicodemus'
        };

        const response = await request
          .put(`/api/user/${user.id}`)
          .set({ Authorization: token })
          .send(fieldToUpdate);
        expect(response.status).toEqual(200);
        expect(response.body.username).toEqual(fieldToUpdate.username);
        done();
      });
    });

    describe('Fetch existing user', () => {
      it('Should successfully fetch a recognized user', async done => {
        const response = await request.get(
          `/api/user/findUser/${regularUser.email}`
        );
        //   .set({ Authorization: token });
        expect(response.status).toEqual(409);
        expect(response.body.error).toBeTruthy();
        expect(response.body.error).toEqual('User already exists');
        done();
      });

      it('Should suggest that a user does not already exist', async done => {
        const response = await request.get('/api/user/findUser/glassboom');
        //   .set({ Authorization: token });
        expect(response.status).toEqual(200);
        expect(response.body.message).toBeTruthy();
        expect(response.body.message).toEqual('User can be created');
        done();
      });
    });

    describe('Delete a user', () => {
      it('Should not allow a delete action if the ID does not exist', async done => {
        const response = await request
          .get('/api/user/666')
          .set({ Authorization: token });
        expect(response.status).toEqual(404);
        expect(response.body.error).toEqual('User does not exist');
        done();
      });
      it('Should succesfully delete a user if a valid id is provided', async done => {
        const response = await request
          .delete(`/api/user/${user.id}`)
          .set({ Authorization: token });
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('User deleted!');
        done();
      });
    });

    describe('Login', () => {
      it('Should bar login for invalid password', async done => {
        const response = await request.post('/api/user/login').send({
          identifier: regularUser.email,
          password: 'klatdycznmsioep'
        });
        expect(response.status).toEqual(401);
        expect(response.body.token).toBeFalsy();
        expect(response.body.error).toEqual('Invalid Credentials');
        done();
      });

      it('Should bar login for nonexistent user', async done => {
        const response = await request.post('/api/user/login').send({
          identifier: 'blaszyzowski@gmail.com',
          password: 'klatdycznmsioep'
        });
        expect(response.status).toEqual(404);
        expect(response.body.token).toBeFalsy();
        expect(response.body.error).toEqual('Invalid Credentials');
        done();
      });

      it('Should allow login when valid credentials are supplied', async done => {
        const { email: identifier, password } = regularUser;
        const response = await request
          .post('/api/user/login')
          .send({ identifier, password });
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
        expect(response.body.message).toEqual(
          'Login Successful! Token expires in one day.'
        );
        done();
      });
    });

    describe('Logout', () => {
      it('should successfully logout a recognized user', async done => {
        const response = await request
          .post('/api/user/logout')
          .set({ Authorization: token });
        expect(response.status).toEqual(200);
        expect(response.body.message).toBeTruthy();
        expect(response.body.message).toEqual('User successfully logged out!');
        done();
      });
    });
  });
});
