import * as C from '../../components';

export const SetupPage = () => (
  <C.Container contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
    <C.Box title="Setup unavailable">
      <C.Typography
        text="The mobile API does not currently provide account setup information or submission."
        variant="body"
      />
    </C.Box>
  </C.Container>
);

export default SetupPage;
