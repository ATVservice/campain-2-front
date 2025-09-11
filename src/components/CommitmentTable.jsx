import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { useState, useEffect } from "react";
import { CgDetailsMore } from "react-icons/cg";
import { useNavigate } from "react-router-dom";


function CommitmentTable({ rowsData, setShowCommitmentsOfActivePeople, showCommitmentsOfActivePeople = true, gridRef }) {
  //   const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const navigate = useNavigate();
  const [originalRowData, setOriginalRowData] = useState({});
  const [searchText, setSearchText] = useState('');




  const commonColumnProps = {
    resizable: true,
    sortable: true,
    filter: true,
    editable: false
  };

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
    gridApi.setQuickFilter(e.target.value);
  };
  const hebrewFilterOptions = [
    {
      displayKey: 'contains',
      displayName: 'מכיל',
      test: (filterValue, cellValue) => {
        return cellValue != null && cellValue.toString().toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
      }
    },
    {
      displayKey: 'startsWith',
      displayName: 'מתחיל ב',
      test: (filterValue, cellValue) => {
        return cellValue != null && cellValue.toString().toLowerCase().startsWith(filterValue.toLowerCase());
      }
    }
  ];

  const heLocaleText = {
    page: "עמוד",
    more: "עוד",
    to: "עד",
    of: "מתוך",
    next: "הבא",
    last: "אחרון",
    first: "ראשון",
    previous: "הקודם",
    loadingOoo: "טוען...",
    noRowsToShow: "אין נתונים להצגה",
  };

  const replaceTextNodes = (rootEl, regex, replacement) => {
    const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null, false);
    const toChange = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (regex.test(node.nodeValue)) {
        toChange.push(node);
      }
    }
    toChange.forEach((node) => {
      node.nodeValue = node.nodeValue.replace(regex, replacement);
    });
  };

  const replacePageSizeEverywhere = () => {
    const containers = document.querySelectorAll(`
    .ag-paging-panel,
    .ag-paging-page-size-panel,
    .ag-paging-page-size,
    .ag-status-bar,
    .ag-root-wrapper
  `);
    containers.forEach((el) => {
      replaceTextNodes(el, /\bpage\s*size\b/gi, "רשומות בעמוד");
    });
  };

  useEffect(() => {
    const t1 = setTimeout(replacePageSizeEverywhere, 0);
    const t2 = setTimeout(replacePageSizeEverywhere, 100);
    const t3 = setTimeout(replacePageSizeEverywhere, 500);

    const root = document.querySelector(".ag-root-wrapper") || document.body;
    const mo = new MutationObserver(() => {
      replacePageSizeEverywhere();
    });
    mo.observe(root, { subtree: true, childList: true, characterData: true });

    return () => {
      [t1, t2, t3].forEach(clearTimeout);
      mo.disconnect();
    };
  }, []);

  const columns = [
    {
      headerName: 'פרטים מלאים',
      field: 'userDetails',
      editable: false,
      cellRenderer: (params) => {
        const handleDetailsClick = () => {
          const _id = params.data._id;
          navigate(`/commitment-details/${_id}`);
        };

        return (
          <div
            onClick={() => handleDetailsClick()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              cursor: 'pointer',
            }}
          >
            <CgDetailsMore style={{ fontSize: '20px' }} />
          </div>
        );
      },
      width: 100,
      headerClass: 'multi-line-header',
    },
    {
      headerName: 'מזהה אנש',
      field: 'AnashIdentifier',
      minWidth: 80,
      maxWidth: 90,
      sort: 'asc', // This will sort the column from lowest to highest by default
      sortable: true,

      headerClass: 'multi-line-header',
      ...commonColumnProps
    },
    {
      headerName: 'מספר זהות',
      field: 'PersonID',
      minWidth: 110,
      maxWidth: 120,
      ...commonColumnProps
    },
    {
      headerName: 'שם',
      field: 'FirstName',
      minWidth: 90,
      maxWidth: 130,
      flex: 1,
      ...commonColumnProps
    },
    {
      headerName: 'משפחה',
      field: 'LastName',
      minWidth: 100,
      maxWidth: 120,
      flex: 1,
      ...commonColumnProps
    },
    {
      headerName: 'סכום התחייבות',
      field: 'CommitmentAmount',
      minWidth: 120,
      maxWidth: 130,
      headerClass: 'multi-line-header',
      ...commonColumnProps
    },
    {
      headerName: 'סכום שנותר',
      field: 'AmountRemaining',
      minWidth: 100,
      maxWidth: 110,
      headerClass: 'multi-line-header',
      ...commonColumnProps
    },
    {
      headerName: 'סכום ששולם',
      field: 'AmountPaid',
      minWidth: 100,
      maxWidth: 110,
      headerClass: 'multi-line-header',
      ...commonColumnProps
    },
    {
      headerName: 'מספר תשלומים',
      field: 'NumberOfPayments',
      minWidth: 100,
      maxWidth: 130,
      headerClass: 'multi-line-header',
      ...commonColumnProps
    },
    {
      headerName: 'תשלומים שנותרו',
      field: 'PaymentsRemaining',
      maxWidth: 130,
      headerClass: 'multi-line-header',
      ...commonColumnProps
    },
    {
      headerName: 'תשלומים שבוצעו',
      field: 'PaymentsMade',
      maxWidth: 130,
      headerClass: 'multi-line-header',
      ...commonColumnProps
    },
    {
      headerName: 'אופן תשלום',
      field: 'PaymentMethod',
      maxWidth: 150,
      headerClass: 'multi-line-header',
      ...commonColumnProps
    },
    { headerName: 'מתרים', field: 'Fundraiser', editable: true, sortable: true, filter: true, width: 100 },

    {
      headerName: 'הערות',
      field: 'Notes',
      minWidth: 150,
      maxWidth: 250,
      width: 150,
      flex: 1,
      ...commonColumnProps
    }
  ];

  // התאמת gridOptions לשימוש במבנה קטן יותר ובצמצום רוחב
  const gridOptions = {
    defaultColDef: {
      minWidth: 50,
      maxWidth: 300,
      resizable: true,
      flex: 1,
    },
    columnDefs: columns,
    domLayout: 'autoHeight',
    suppressHorizontalScroll: true,
    onFirstDataRendered: (params) => {
      params.api.sizeColumnsToFit();
    },
    onGridReady: (params) => {
      params.api.autoSizeAllColumns();
    }
  };

  // הוספת CSS מותאם לכותרות
  const styles = `
        .multi-line-header .ag-header-cell-label {
          white-space: normal !important;
          line-height: 1.2;
          text-align: center;
        }
        
        .ag-header-cell-label {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
          .ag-root-wrapper {
  z-index: 0; 
}
      `;

  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onRowEditingStarted = (params) => {
    const originalData = { ...params.data }; // Clone the original row data
    setOriginalRowData(originalData);
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  };

  const onRowEditingStopped = (params) => {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  };

  const gridStyle = {
    height: '70vh',
    overflow: 'auto',
    overflowX: 'hidden',
    margin: '0 auto',
    width: '98vw',
    position: 'relative', // Add this
  };
  const searchStyle = {
    position: 'relative',
    zIndex: 2,
  };



  return (
    <div> {/* Wrapper with stacking context */}
      <div className="flex items-center gap-2 py-2 bg-gray-100 px-4">
        <input
          type="text"
          placeholder="חפש..."
          value={searchText}
          onChange={onSearchChange}
          className="border rounded"
          style={searchStyle}
        />
        <input type="checkbox" checked={showCommitmentsOfActivePeople}
          className="border border-gray-300 rounded-sm focus:outline-none w-4 h-4 focus:ring-2 focus:ring-sky-100"
          onChange={() => setShowCommitmentsOfActivePeople(!showCommitmentsOfActivePeople)} />
      </div>

      <div className="ag-theme-alpine" style={gridStyle}>
        <AgGridReact
          columnDefs={columns}
          rowData={rowsData}
          pagination={true}
          paginationPageSize={50}
          domLayout="normal"
          enableRtl={true}
          localeText={heLocaleText}
          quickFilterText={searchText}
          defaultColDef={{
            minWidth: 50,
            maxWidth: 300,
            resizable: true,
            sortable: true,
            filter: true,
            editable: false,
            filterParams: {
              filterOptions: hebrewFilterOptions,
            },
          }}
          gridOptions={{
            enableCellTextSelection: true,
            localeText: {
              noRowsToShow: 'אין שורות להצגה'

            }

          }}
          suppressRowTransform={true}
          ref={gridRef}
        />
      </div>
    </div>
  );
};

export default CommitmentTable