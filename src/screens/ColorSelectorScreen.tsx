import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import {
  Text,
  Button,
  Card,
  Switch,
  ActivityIndicator,
} from "react-native-paper";
import { supabase } from "../lib/supabaseClient";

type Item = {
  コード: number | null;
  商品名: string;
  セット名: string;
  シリーズ名: string;
  購入済み?: boolean;
  __source?: "GreenOcean" | "Padico";
};
export default function ColorSelectorScreen() {
  const [colors, setColors] = useState<Item[]>([]);
  const [padicoColors, setPadicoColors] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDecided, setDecided] = useState(false);
  const [onlyPurchased, setOnlyPurchased] = useState(false);
  const [includePadico, setIncludePadico] = useState(false);

  const [selectedColors, setSelectedColors] = useState<Item[]>([]);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateResult = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    fetchColors();
  }, [onlyPurchased]);

  const fetchColors = async () => {
    setLoading(true);
    try {
      // --- GreenOcean ---

      let query = supabase.from("GreenOcean_Color").select("*");
      // カラリー Switch が「購入済み」の時だけ絞り込み

      if (onlyPurchased) {
        query = query.eq("購入済み", true);
      }
      const { data: green, error: gErr } = await query;
      //Padico
      const { data: padico, error: pErr } = await supabase
        .from("Padico_Color")
        .select("*");

      if (!gErr && green) {
        const withTag = green.map((v) => ({ ...v, __source: "GreenOcean" }));
        setColors(withTag);
      }
      if (!pErr && padico) {
        const withTag = padico.map((v) => ({
          ...v,
          コード: null,
          __source: "Padico",
        }));
        setPadicoColors(withTag);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching colors:", error);
      setLoading(false);
    }
  };
  // GreenOcean ランダム 2色
  const handleSelect = () => {
    if (colors.length < 2) return;
    const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

    const selectedGreen = shuffle(colors).slice(0, 2);
    let final = [...selectedGreen];
    //Padico
    if (includePadico && padicoColors.length >= 2) {
      const selectedPadico = shuffle(padicoColors).slice(0, 2);

      final = [...final, ...selectedPadico];
    }
    setSelectedColors(final);
  };
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>カラーセレクター 🎀</Text>
        <Text style={styles.subTitle}>カラリー</Text>
        <View style={styles.toggleRow}>
          <Text>すべて</Text>
          <Switch value={onlyPurchased} onValueChange={setOnlyPurchased} />
          <Text>購入済み</Text>
        </View>
        <Text style={styles.subTitle}>パジコカラー</Text>
        <View style={styles.toggleRow}>
          <Text>含まない</Text>
          <Switch value={includePadico} onValueChange={setIncludePadico} />
          <Text>含む</Text>
        </View>

        {loading && (
          <ActivityIndicator style={{ marginTop: 20 }} animating={true} />
        )}
        <Button
          mode="contained"
          onPress={() => {
            animateResult(() => {
              setDecided(true);
              handleSelect();
            });
          }}
          style={styles.okButton}
        >
          {isDecided ? "変更する" : "OK"}
        </Button>
        <Animated.View style={{ opacity: fadeAnim, marginTop: 20 }}>
          {selectedColors.map((item, index) => (
            <Card key={index} style={styles.resultCard}>
              <Text style={styles.resultText}>
                {item.__source === "GreenOcean"
                  ? `${item.コード}番${item.セット名}の${item.商品名}`
                  : `${item.シリーズ名}の${item.商品名}`}
              </Text>
            </Card>
          ))}
        </Animated.View>
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
  subTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    gap: 5,
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
