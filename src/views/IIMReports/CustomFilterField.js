import React, { useEffect } from 'react';
import { Input } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateSearchValue } from '../../actions';
const { Search } = Input;
const CustomFilterField = (props) => {
  const dispatch = useDispatch();
  const UpdateSearchValueData = useSelector((state) => state.UpdateSearchValue.SearchValue);
  const filter = (e, col) => {
    if (e.length > 0) {
      let value = `${col.dataField} = '${e}'`;
      // let value = col.dataField + ' ' + '=' + ' ' + e;
      dispatch(UpdateSearchValue(value, col.dataField));
    }
  };
  const [InputValue, setInputValue] = useState('');
  useEffect(() => {
    if (UpdateSearchValueData.length === 0) {
      setInputValue('');
    }
  }, [UpdateSearchValueData]);
  return (
    <>
      <Search
        size="small"
        // placeholder={`${props.column.text}`}
        placeholder="Filter"
        onSearch={(e) => filter(e, props.column)}
        onChange={(e) => setInputValue(e.target.value)}
        value={InputValue}
        className="tbl-fil"></Search>
    </>
  );
};

export default CustomFilterField;
