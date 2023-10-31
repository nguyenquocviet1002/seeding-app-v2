import DataTable from 'react-data-table-component';

const paginationComponentOptions = {
  selectAllRowsItem: true,
  selectAllRowsItemText: 'All',
};
const customStyles = {
  headRow: {
    style: {
      borderBottom: '2px solid rgba(0, 0, 0, 0.12)',
    },
  },
  headCells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
      fontSize: '15px',
      fontWeight: '600',
    },
  },
  rows: {
    style: {
      minHeight: '50px',
      fontSize: '14px',
    },
  },
  cells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  },
};
const componentEmpty = <div style={{ padding: '24px' }}>Dữ liệu trống</div>;

const Table = ({ columns, data }) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      paginationComponentOptions={paginationComponentOptions}
      paginationRowsPerPageOptions={[10, 20, 50]}
      noDataComponent={componentEmpty}
      customStyles={customStyles}
      highlightOnHover
    />
  );
};

export default Table;
