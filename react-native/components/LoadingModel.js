import React from 'react';

import {
  Modal,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';

export default class LoadingModel extends React.PureComponent {
  state = {
    visible: false,
  }

  show = () => this.setState({ visible: true });
  dismiss = () => this.setState({ visible: false });

  render() {
    const { visible } = this.state;

    return (
      <Modal
        transparent
        animationType='fade'
        visible={ visible }
      >
        <View style={ styles.backdrop }>
          <ActivityIndicator />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0006',
  },
});