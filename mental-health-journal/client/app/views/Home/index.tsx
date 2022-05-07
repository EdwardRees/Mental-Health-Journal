import React from "react";
import { View, Text } from "react-native";
import { primary } from "../../constants";
import { Container } from "../../components";

const Home = () => {
  return (
    <Container>
      <Text style={{ color: primary }}>Home</Text>
    </Container>
  );
};

export { Home };
