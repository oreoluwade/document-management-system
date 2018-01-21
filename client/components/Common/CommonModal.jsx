import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentForm from '../DocumentPage/DocumentForm';

class CommonModal extends React.Component {
  componentDidMount() {
    $('.modal').modal();
    $('select').material_select();
    $('#title').parent().find('label').addClass('active');
  }

  render() {
    const { auth, doc = {} } = this.props;
    return (
      <div>
        <div id="docDisplayModal" className="modal">
          <div>
            <a
              href="#"
              className="btn-floating btn-flat blue-grey closeModal modal-close">
              <i className="material-icons">close</i>
            </a>
          </div>
          <div className="modal-content">
            <h4>Document</h4>
            <DocumentForm auth={auth} doc={doc} />
          </div>
        </div>
      </div>
    );
  }
}

CommonModal.propTypes = {
  auth: PropTypes.object.isRequired,
  doc: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(CommonModal);
