import * as React from "react";
import { View, Text } from "react-native";
import { Container } from "../../components";
import { primary } from "../../constants";

const Mood = () => {
  return (
    <Container>
      <Text style={{ color: primary }}>Mood</Text>
    </Container>
  );
};

export { Mood };
