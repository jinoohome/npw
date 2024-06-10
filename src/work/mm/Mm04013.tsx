import React, { useState, useEffect } from "react";
import 'tui-grid/dist/tui-grid.css';
import Grid from '@toast-ui/react-grid';
import TuiGrid from 'tui-grid';

TuiGrid.setLanguage('ko');
TuiGrid.applyTheme('striped');


const Mm0401: React.FC<{ itemId: string }> = ({ itemId }) => {

  const data = [
    {id: 1, name: 'Editor'},
    {id: 2, name: 'Grid'},
    {id: 3, name: 'Chart'}
  ];
  
  const columns = [
    {name: 'id', header: 'ID'},
    {name: 'name', header: 'Name'}
  ];
  
  const MyComponent = () => (
    <Grid
      data={data}
      columns={columns}
      rowHeight={25}
      bodyHeight={100}
      heightResizable={true}
      rowHeaders={['rowNum']}
      oneTimeBindingProps={['data', 'columns']}
    />
  
  );

   return (
      <div>
        {MyComponent()}    
      
      </div>
   );
};

export default Mm0401;
