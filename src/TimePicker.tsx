// Imports: Dependencies
import React, { useState, useEffect } from 'react';
import { Appearance, Button, Dimensions, Keyboard, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';

// Screen Dimensions
const { height, width } = Dimensions.get('window');

// Dark Mode
const colorScheme = Appearance.getColorScheme();

// TypeScript: Types
interface Props {
  title?: string;
  mode: 'spinner' | 'default' | 'clock';
  onChange: (date: Date | string) => Date | string | void;
}

// Component: Time Picker
const TimePicker = (props: Props) => {
  // React Hooks: State
  const [ modalVisible, toggle ] = useState(false);
  const [ androidModalVisible, toggleAndroid ] = useState(false);
  const [ date, setDate ] = useState(new Date());
  const [ tempDate, setTempDate ] = useState(date);
  const [ today , todaySent ] = useState(false);

  // React Hooks: Lifecycle Methods
  useEffect(() => {
    // Send Initial Date
    if (today === false) {
      // Props: onChange
      props.onChange(new Date());

      // Today's Date Has Been Sent To Parent Component
      todaySent(true);
    }
  }, [props]);

  // Toggle Modal
  const toggleModal = () => {
    // Check Platform (Android)
    if (Platform.OS === 'android') {
      // React Hook: Toggle Android
      toggleAndroid((androidModalVisible: boolean) => !androidModalVisible);
    }

    // Check Platform (iOS)
    else if (Platform.OS === 'ios') {
      // React Hook: Toggle Modal
      toggle((modalVisible: boolean) => !modalVisible);
    }

    // Dismiss Keyboard
    Keyboard.dismiss();
  };

  // Select Date
  const selectDate = (event: any, newDate: Date) => {
    // Check Platform: Android
    if (Platform.OS === 'android') {

      // Undefined
      if (newDate === undefined) {
        // React Hook: Toggle Android
        toggleAndroid((androidModalVisible: boolean) => !androidModalVisible);
      }

      // Event Type: Set Date
      else if (event.type === 'set') {
        // React Hook: Toggle Android
        toggleAndroid((androidModalVisible: boolean) => !androidModalVisible);

        // React Hook: Set From Date
        setDate(newDate);

        // React Props: onChange
        props.onChange(newDate);
      }

      // Event Type: Dismissed
      else if (event.type === 'dismissed') {
        // React Hook: Toggle Android
        toggleAndroid((androidModalVisible: boolean) => !androidModalVisible);
      }
    }

    // Check Platform: Android
    else if (Platform.OS === 'ios') {
      // React Hook: Set Temp State
      setTempDate(newDate);
    }
  };

  // Render iOS Picker
  const renderIOSPicker = () => {
    return (
      <RNDateTimePicker
        mode="time"
        value={tempDate ? tempDate : date}
        onChange={(event: any, newDate: any) => selectDate(event, newDate)}
      />
    );
  };

  // Press Cancel
  const pressCancel = () => {
    // React Hook: Set Temp Date
    setTempDate(date);

    // Toggle Modal
    toggleModal();
  };

  // Press Done
  const pressDone = () => {
    // React Hook: Set Date
    setDate(tempDate);

    // Props: onChange
    props.onChange(tempDate);

    // Toggle Modal
    toggleModal();
  };

  // Render Android Picker
  const renderAndroidPicker = () => {
    if (androidModalVisible === true) {
      return (
        <RNDateTimePicker
          mode="time"
          display={props.mode}
          value={date}
          onChange={(event: any, newDate: any) => selectDate(event, newDate)}
        />
      );
    }
  };

  // Format Time
  const formatTime = (date: Date) => {
    // Options
    const options = {
      hour: 'numeric',
      minute: 'numeric',
    };

    return date.toLocaleTimeString('en-US', options);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputTitleContainer}>
        <Text style={styles.inputTitle}>{props.title === undefined ? 'Time' : props.title}</Text>
      </View>

      <TouchableOpacity onPress={() => toggleModal()} style={styles.fieldTextContainer}>
        <Text style={styles.fieldText} numberOfLines={1}>{formatTime(date)}</Text>
      </TouchableOpacity>

      <View>{androidModalVisible === true ? renderAndroidPicker(): null}</View>

      <Modal
        isVisible={modalVisible}
        style={styles.modal}
        backdropOpacity={.30}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerHeaderContainer}>
            <TouchableOpacity onPress={() => pressCancel()} >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <View style={styles.doneButton}>
              <Button
                onPress={() => pressDone()}
                title="Done"
                disabled={date === tempDate ? true : false}
              />
            </View>
          </View>

          <View style={styles.pickerContainer}>{renderIOSPicker()}</View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: width,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
  },
  modal: {
    margin: 0,
  },
  modalContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  pickerHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 45,
    width: width,
    backgroundColor: colorScheme === 'dark' ? '#383838' : '#FFFFFF',
    borderColor: '#7D7D7D',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pickerContainer: {
    height: 250,
    width: width,
    backgroundColor: colorScheme === 'dark' ? '#121312' : '#FFFFFF',
  },
  doneButton: {
    marginRight: 7,
  },
  doneText: {
    fontFamily: 'System',
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 17,
    marginRight: 16,
  },
  cancelText: {
    fontFamily: 'System',
    color: '#007AFF',
    fontWeight: '400',
    fontSize: 17,
    marginLeft: 16,
  },
  stateContainer: {
    alignItems: 'center',
    width: 75,
    borderColor: '#7D7D7D',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputTitleContainer: {
    width: 75,
    marginBottom: 4,
  },
  inputTitle: {
    color: '#7D7D7D',
    borderColor: '#7D7D7D',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  fieldTextContainer: {
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderColor: '#7D7D7D',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fieldText: {
    width: width - 32 - 20,
    fontFamily: 'System',
    fontSize: 17,
    fontWeight: '400',
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    alignSelf: 'center',
  },
  arrowForward: {
    color: 'black',
    opacity: .3,
    marginRight: 7,
  },
});

// Exports
export default TimePicker;
