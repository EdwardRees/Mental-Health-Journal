import * as React from 'react';
import { Container } from '../../components';
import { primary } from '../../constants';
import { Text } from 'react-native';

const Affirmation = () => {
  return (
    <Container>
      <Text style={{ color: primary }}>Affirmation</Text>
    </Container>
  );
}

export { Affirmation };