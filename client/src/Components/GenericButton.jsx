import React from 'react';
import { Button } from 'antd';
import { useGenericButton } from '../CustomHook/useGenericButton';

function GenericButton({ label, action }) {
  const { handleClick, loading } = useGenericButton(action);

  return (
    <Button onClick={handleClick} loading={loading}>
      {label}
    </Button>
  );
}

export default GenericButton;
