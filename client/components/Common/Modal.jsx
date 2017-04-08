/* eslint class-methods-use-this: "off"*/
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentForm from '../DocumentPage/DocumentForm.jsx';

class Modal extends React.Component {
  componentDidMount() {
    $('.modal').modal();
    $('select').material_select();
    $('#title').parent().find('label').addClass('active');
  }

  render() {
    const { auth, document } = this.props;
    return (
      <div>
        <div id="docDisplayModal" className="modal">
          <div>
            <a href="#"
              className="btn-floating btn-flat blue-grey closeModal modal-close"
            >
              <i className="material-icons">close</i>
            </a>
          </div>
          <div className="modal-content">
            <h4>Document</h4>
            <DocumentForm auth={auth} document={document} />
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  auth: PropTypes.object.isRequired,
  document: PropTypes.object
};

/**
 * @param  {object} state
 * @return {object}
 */
function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(Modal);
