import * as C from './../../components';
import { Typography } from './../../components/Typography/Typography';

export const Home = () => {
  return (
    <C.Container>
      <C.Box title="Home">
        <Typography text="This is a simple placeholder screen." variant="body" />
      </C.Box>
    </C.Container>
  );
};
