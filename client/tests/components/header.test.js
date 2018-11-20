import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import { Header, mapStateToProps } from '../../components/Common/Header';

describe('Header Component', () => {
  let wrapper;
  const mockFunc = sinon.spy();
  const headerProps = {
    isAuthenticated: false,
    user: {},
    logout: mockFunc,
    isAdmin: false
  };

  describe('when user is signed out', () => {
    beforeEach(() => {
      wrapper = shallow(<Header {...headerProps} />);
    });
    it('should have Links', () => {
      expect(wrapper.find(Link)).to.have.length(2);
      // expect(wrapper.find(IndexLink)).to.have.length(1);
    });
  });

  describe('when user is signed in', () => {
    const authProps = {
      isAuthenticated: true,
      user: {
        userName: 'test'
      }
    };
    let navItem;
    beforeEach(() => {
      wrapper = shallow(<Header {...headerProps} {...authProps} />);
      navItem = wrapper.find('ul').at(1);
    });
    it('should have Links', () => {
      expect(navItem.html()).to.contain(`Hello, ${authProps.user.userName}`);
      expect(wrapper.find(Link)).to.have.length(2);
      // expect(wrapper.find(IndexLink)).to.have.length(1);
    });
    it('should trigger logout when clicked', () => {
      const logoutLink = navItem.find('li').last().find('a');
      logoutLink.simulate('click', { preventDefault: mockFunc });
      expect(mockFunc).to.have.property('callCount', 2);
    });
  });

  describe('mapStateToProps', () => {
    it('should return correct props if user is not authenticated', () => {
      const mockState = { auth: { isAuthenticated: false } };
      const { isAuthenticated, user, isAdmin } = mapStateToProps(mockState);
      expect(isAuthenticated).to.equal(false);
      expect(user).to.be.undefined;  //eslint-disable-line
      expect(isAdmin).to.equal(false);
    });
    it('should return correct props if user is authenticated', () => {
      const mockState = { auth: { isAuthenticated: true, user: { userRoleId: 2 } } };
      const { isAuthenticated, user, isAdmin } = mapStateToProps(mockState);
      expect(isAuthenticated).to.equal(true);
      expect(user).to.be.defined; //eslint-disable-line
      expect(isAdmin).to.equal(false);
    });
    it('should return correct props if user is authenticated', () => {
      const mockState = { auth: { isAuthenticated: true, user: { userRoleId: 1 } } };
      const { isAuthenticated, user, isAdmin } = mapStateToProps(mockState);
      expect(isAuthenticated).to.equal(true);
      expect(user).to.be.defined;  //eslint-disable-line
      expect(isAdmin).to.equal(true);
    });
  });
});
