import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Calculator, Info, RefreshCw } from 'lucide-react-native';

export default function MaterialCalculator({ category, unit }) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [thickness, setThickness] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const t = parseFloat(thickness) || 0;

    if (!l || !w) {
      alert('Please enter length and width.');
      return;
    }

    let total = 0;
    let explanation = "";

    if (category === 'Cement') {
      const volumeCuFt = (l * w * (t / 12));
      total = Math.ceil(volumeCuFt * 0.88);
      explanation = `Based on a standard 1:2:4 concrete mix for a ${t}" thick slab.`;
    } else if (category === 'Bricks & Blocks') {
      const area = l * w;
      const multiplier = t > 5 ? 10 : 5; // 9" wall vs 4.5" wall
      total = Math.ceil(area * multiplier);
      explanation = `Estimated for a ${t > 5 ? '9"' : '4.5"'} brick wall masonry.`;
    } else if (category === 'Paint & Finishes') {
      const area = l * w;
      total = Math.ceil(area / 60);
      explanation = "Calculated for a standard double-coat exterior/interior finish.";
    } else {
      total = Math.ceil(l * w);
      explanation = "Calculated based on total surface area.";
    }

    setResult({ total, explanation });
  };

  const reset = () => {
    setLength('');
    setWidth('');
    setThickness('');
    setResult(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Calculator color="#ea580c" size={20} />
        <Text style={styles.title}>{category} Quantity Estimator</Text>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Length (ft)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={length}
            onChangeText={setLength}
            placeholder="0"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Width (ft)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={width}
            onChangeText={setWidth}
            placeholder="0"
          />
        </View>

        {category !== 'Paint & Finishes' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thickness (in)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={thickness}
              onChangeText={setThickness}
              placeholder="0"
            />
          </View>
        )}
      </View>

      {!result ? (
        <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
          <Text style={styles.calcBtnText}>Calculate Needed Amount</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.resultBox}>
          <View style={styles.resultHeader}>
            <View>
              <Text style={styles.recLabel}>Recommended Order</Text>
              <Text style={styles.resultValue}>
                {result.total} <Text style={styles.resultUnit}>{unit.split(' ')[1] || 'Units'}</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={reset} style={styles.resetBtn}>
              <RefreshCw color="#94a3b8" size={18} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Info color="#ea580c" size={16} style={styles.infoIcon} />
            <Text style={styles.infoText}>{result.explanation}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff7ed',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ffedd5',
    padding: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    color: '#7c2d12',
    marginLeft: 6,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#c2410c',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#fed7aa',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  calcBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 10,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  resultBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#fed7aa',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  resultValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },
  resultUnit: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '700',
  },
  resetBtn: {
    padding: 6,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
    lineHeight: 14,
  }
});
