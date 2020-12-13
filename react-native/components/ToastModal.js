import React from 'react';

import {
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const __AUTO_DISMISS_TIMEOUT = 1000;

export default class ToastModal extends React.PureComponent {
  state = {
    message: '',
    visible: false,
  }

  show = message => this.setState({ message, visible: true });
  dismiss = () => this.setState({ visible: false });

  handleOnShow = () => setTimeout(this.dismiss, __AUTO_DISMISS_TIMEOUT);
  handleOnTouchStart = () => this.dismiss();

  render() {
    const { message, visible } = this.state;

    return (
      <Modal
        transparent
        animationType='fade'
        visible={ visible }
        onShow={ this.handleOnShow }
      >
        <View style={ styles.backdrop } onTouchStart={ this.handleOnTouchStart }>
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
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
  },
  container: {
    padding: 16,
    backgroundColor: '#0003',
    borderRadius: 16
  }
});