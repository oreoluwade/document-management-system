import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FlashMessage from './FlashMessage';
import { deleteFlashMessage } from '../../actions/flashMessages';

const FlashMessagesList = (props) => {
  const messages = props.messages.map(message =>
    <FlashMessage
      key={message.id}
      message={message}
      deleteFlashMessage={props.deleteFlashMessage} />
  );
  return (
    <React.Fragment>
      {messages}
    </React.Fragment>
  );
};

FlashMessagesList.propTypes = {
  messages: PropTypes.array.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    messages: state.flashMessages
  };
}

export default connect(mapStateToProps, {
  deleteFlashMessage
})(FlashMessagesList);
