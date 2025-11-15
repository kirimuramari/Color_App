import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  Button,
  Card,
  Switch,
  ActivityIndicator,
} from "react-native-paper";
import { supabase } from "../lib/supabaseClient";

type Item = {
  コード: number;
  商品名: string;
  セット名: string;
  購入済み: boolean;
};
export default function ColorSelectorScreen() {
  const [colors, setColors] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const [twoColors, setTwoColors] = useState(false);
  const [onlyPurchased, setOnlyPurchased] = useState(false);

  const [selectedColors, setSelectedColors] = useState<Item[]>([]);

  useEffect(() => {
    fetchColors();
  }, [onlyPurchased]);

  const fetchColors = async () => {
    setLoading(true);
    let query = supabase.from("GreenOcean_Color").select("*");
    if (onlyPurchased) {
      query = query.eq("購入済み", true);
    }
    const { data, error } = await query;

    if (!error && data) {
      setColors(data as Item[]);
    }
    setLoading(false);
  };
  const handleSelect = () => {
    if (colors.length === 0) return;

    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    const pickCount = twoColors ? 2 : 1;
    setSelectedColors(shuffled.slice(0, pickCount));
  };
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>カラーセレクター 🎀</Text>
        <View style={styles.toggleRow}>
          <Text>すべて</Text>
          <Switch value={onlyPurchased} onValueChange={setOnlyPurchased} />
          <Text>購入済み</Text>
        </View>
        <View style={styles.toggleButtonRow}>
          <Button
            mode={twoColors ? "outlined" : "contained"}
            onPress={() => setTwoColors(false)}
            style={styles.toggleButton}
          >
            1色
          </Button>
          <Button
            mode={twoColors ? "contained" : "outlined"}
            onPress={() => setTwoColors(true)}
            style={styles.toggleButton}
          >
            2色
          </Button>
        </View>
        {loading && (
          <ActivityIndicator style={{ marginTop: 20 }} animating={true} />
        )}
        <Button mode="contained" onPress={handleSelect} style={styles.okButton}>
          OK
        </Button>
        <View style={{ marginTop: 20 }}>
          {selectedColors.map((item, index) => (
            <Card key={index} style={styles.resultCard}>
              <Text style={styles.resultText}>
                {item.コード}番{item.セット名}の{item.商品名}
              </Text>
            </Card>
          ))}
        </View>
      </Card>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    padding: 20,
    borderRadius: 25,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    gap: 5,
  },
  toggleButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  toggleButton: {
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  okButton: {
    marginTop: 20,
    borderRadius: 20,
    paddingVertical: 5,
  },
  resultCard: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 20,
  },
  resultText: {
    fontSize: 18,
    textAlign: "center",
  },
});
