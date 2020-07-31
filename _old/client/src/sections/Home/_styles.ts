import styled from 'styled-components';

export const HomeWrapper = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  margin: auto;
  max-width: 700px;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;

  & .input {
    border-bottom-right-radius: 0;
    border-right: none;
    border-top-right-radius: 0;
    flex: 1;
  }

  & button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;
