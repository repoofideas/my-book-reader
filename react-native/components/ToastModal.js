import React from 'react';

import {
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class ToastModal extends React.PureComponent {
  state = {
    message: '',
    visible: false,
  }

  show = message => this.setState({ message, visible: true });
  dismiss = () => this.setState({ visible: false });

  componentDidUpdate() {
    if (this.state.visible === true) {
      setTimeout(this.dismiss, 1000);
    };
  }

  render() {
    const { message, visible } = this.state;

    return (
      <Modal
        transparent
        animationType='fade'
        visible={ visible }
      >
        <View style={ styles.backdrop }>
          <View style={ styles.container }>
            <Text>{ message }</Text>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    padding: 16,
    backgroundColor: '#fffd',
    borderRadius: 16
  }
});