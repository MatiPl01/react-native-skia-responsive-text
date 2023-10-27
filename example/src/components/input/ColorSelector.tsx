import { useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ColorPicker, {
  HueSlider,
  OpacitySlider,
  Panel1,
  Preview,
  Swatches
} from 'reanimated-color-picker';
import { INPUT_FIELD_HEIGHT } from 'src/constants';

type ColorSelectorModalProps = {
  onSelect: (value?: string) => void;
  value?: string;
};

function ColorSelectorModal({
  onSelect,
  value = 'black'
}: ColorSelectorModalProps) {
  const selectedColorRef = useRef(value);

  return (
    <Modal animationType='slide' visible={true}>
      <View style={styles.pickerWrapper}>
        <ColorPicker
          style={styles.picker}
          value={value}
          onComplete={({ hex }) => {
            selectedColorRef.current = hex;
          }}>
          <Preview />
          <Panel1 />
          <HueSlider />
          <OpacitySlider />
          <Swatches />
        </ColorPicker>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.colorSelectorButton}
            onPress={() => onSelect(undefined)}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.colorSelectorButton}
            onPress={() => onSelect(selectedColorRef.current)}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

type ColorSelectorProps = {
  label?: string;
  onChange: (value?: string) => void;
  value?: string;
};

export default function ColorSelector({
  label,
  onChange,
  value
}: ColorSelectorProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setShowModal(true)}>
        <View style={[{ backgroundColor: value }, styles.currentColor]}>
          {value === undefined && <Text style={styles.colorText}>None</Text>}
        </View>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
      {showModal && (
        <ColorSelectorModal
          value={value}
          onSelect={color => {
            onChange(color);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: '#333',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10
  },
  colorSelectorButton: {
    backgroundColor: '#ddd',
    borderRadius: 10,
    height: INPUT_FIELD_HEIGHT,
    justifyContent: 'center',
    marginTop: 25,
    paddingHorizontal: 25
  },
  colorText: {
    color: '#777',
    fontFamily: 'Poppins-Regular',
    fontSize: 14
  },
  currentColor: {
    alignItems: 'center',
    borderColor: '#777',
    borderRadius: 10,
    borderWidth: 1,
    height: INPUT_FIELD_HEIGHT,
    justifyContent: 'center',
    width: INPUT_FIELD_HEIGHT
  },
  label: {
    color: '#666',
    fontFamily: 'Poppins-Regular',
    fontSize: 14
  },
  picker: {
    gap: 25
  },
  pickerWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 25
  },
  selector: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-start'
  }
});
