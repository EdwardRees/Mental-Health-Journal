import * as React from "react";
import { View, Text } from "react-native";
import { primary, backgroundColor } from "../../constants";

const Container = ({ children }: any) => {
  return (
    <View style={{ flex: 1, backgroundColor: backgroundColor }}>
      {children}
    </View>
  );
};

export { Container };
