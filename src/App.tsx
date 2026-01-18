import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { fetchArtworks } from './services/api';
import type { Artwork } from './types';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rowsPerPage] = useState(12);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const overlayRef = useRef<OverlayPanel>(null);
  const [selectCount, setSelectCount] = useState<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [remainingSelections, setRemainingSelections] = useState<number>(0);
  const [targetSelectionCount, setTargetSelectionCount] = useState<number>(0);

  useEffect(() => {
    loadArtworks(currentPage);
  }, [currentPage]);

  const loadArtworks = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetchArtworks(page);
      setArtworks(response.data);
      setTotalRecords(response.pagination.total);
    } catch (error) {
      console.error('Failed to load artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Keep selectedRows in sync with selectedIds for the current page
  useEffect(() => {
    const pageSelected = artworks.filter(item => selectedIds.has(item.id));
    setSelectedRows(pageSelected);
    
    // Auto-select rows if there are remaining selections needed
    if (remainingSelections > 0) {
      const updatedSelection = new Set(selectedIds);
      let added = 0;
      
      for (const artwork of artworks) {
        if (added >= remainingSelections) {
          break;
        }
        
        if (!updatedSelection.has(artwork.id)) {
          updatedSelection.add(artwork.id);
          added++;
        }
      }
      
      if (added > 0) {
        setSelectedIds(updatedSelection);
        setRemainingSelections(prev => Math.max(0, prev - added));
        
        // If we've reached the target, reset the target count
        if (updatedSelection.size >= targetSelectionCount) {
          setTargetSelectionCount(0);
        }
      }
    }
    
    // If we've reached or exceeded the target count, reset it
    if (targetSelectionCount > 0 && selectedIds.size >= targetSelectionCount && remainingSelections === 0) {
      setTargetSelectionCount(0);
    }
  }, [artworks, selectedIds, remainingSelections, targetSelectionCount]);

  const handlePageChange = (event: any) => {
    // PrimeReact paginator uses 0-based page index, API uses 1-based
    const pageIndex = event.page ?? 0;
    setCurrentPage(pageIndex + 1);
  };

  const handleSelectionChange = (e: any) => {
    const newlySelected = e.value as Artwork[];
    const updatedIds = new Set(selectedIds);
    
    // Clear selections for current page items first
    const currentIds = artworks.map(a => a.id);
    currentIds.forEach(id => updatedIds.delete(id));
    
    // Then add the newly selected items
    newlySelected.forEach(item => {
      updatedIds.add(item.id);
    });
    
    setSelectedIds(updatedIds);
    
    // Reset target selection count if user manually changes selection
    if (targetSelectionCount > 0) {
      setTargetSelectionCount(0);
      setRemainingSelections(0);
    }
  };

  const handleCustomSelection = () => {
    if (!selectCount || selectCount <= 0) {
      alert('Please enter a valid number greater than 0');
      return;
    }

    const targetCount = selectCount;
    
    // Set the target count for display - this will show immediately
    setTargetSelectionCount(targetCount);
    
    // Clear existing selections and start fresh
    const updatedSelection = new Set<number>();
    let selectedCount = 0;

    // Select rows from current page first
    for (const artwork of artworks) {
      if (selectedCount >= targetCount) {
        break;
      }
      
      updatedSelection.add(artwork.id);
      selectedCount++;
    }

    // Calculate remaining selections needed after selecting from current page
    const remaining = targetCount - selectedCount;
    
    // Update selection state immediately
    setSelectedIds(updatedSelection);
    
    // Set remaining selections - this will auto-select as user navigates pages
    if (remaining > 0) {
      setRemainingSelections(remaining);
    } else {
      setRemainingSelections(0);
    }
    
    setSelectCount(null);
    overlayRef.current?.hide();
  };

  const handleDeselectCustom = () => {
    if (!selectCount || selectCount <= 0) {
      alert('Please enter a valid number greater than 0');
      return;
    }

    const targetCount = selectCount;
    const updatedSelection = new Set(selectedIds);
    let deselectedCount = 0;

    // Deselect rows from current page only
    for (const artwork of artworks) {
      if (deselectedCount >= targetCount) {
        break;
      }
      
      if (updatedSelection.has(artwork.id)) {
        updatedSelection.delete(artwork.id);
        deselectedCount++;
      }
    }

    setSelectedIds(updatedSelection);
    setSelectCount(null);
    overlayRef.current?.hide();
  };

  const titleBodyTemplate = (rowData: Artwork) => {
    return <span>{rowData.title || 'N/A'}</span>;
  };

  const placeBodyTemplate = (rowData: Artwork) => {
    return <span>{rowData.place_of_origin || 'N/A'}</span>;
  };

  const artistBodyTemplate = (rowData: Artwork) => {
    return <span>{rowData.artist_display || 'N/A'}</span>;
  };

  const inscriptionsBodyTemplate = (rowData: Artwork) => {
    return <span>{rowData.inscriptions || 'N/A'}</span>;
  };

  const dateStartBodyTemplate = (rowData: Artwork) => {
    return <span>{rowData.date_start ?? 'N/A'}</span>;
  };

  const dateEndBodyTemplate = (rowData: Artwork) => {
    return <span>{rowData.date_end ?? 'N/A'}</span>;
  };

  const headerContent = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <div>
        <span style={{ fontSize: '0.875rem', color: '#666' }}>
          Selected: {targetSelectionCount > 0 ? targetSelectionCount : selectedIds.size} rows
        </span>
      </div>
      <Button 
        ref={buttonRef}
        label="Select Multiple Rows" 
        icon="pi pi-check-square" 
        onClick={(e) => overlayRef.current?.toggle(e)}
      />
    </div>
  );

  // Custom paginator footer component
  const paginatorFooter = () => {
    const first = (currentPage - 1) * rowsPerPage;
    const last = Math.min(first + rowsPerPage - 1, totalRecords - 1);
    const displayFirst = first + 1;
    const displayLast = last + 1;
    const totalPages = Math.ceil(totalRecords / rowsPerPage);
    const maxPagesToShow = 5;
    
    // Calculate which page numbers to show
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return (
      <div className="custom-paginator-footer">
        <span className="pagination-info">
          Showing <strong>{displayFirst}</strong> to <strong>{displayLast}</strong> of <strong>{totalRecords}</strong> entries
        </span>
        <div className="pagination-controls">
          <button
            type="button"
            className="p-paginator-prev p-link"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            <span className="p-paginator-icon pi pi-angle-left"></span>
          </button>
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
            const pageNum = startPage + i;
            return (
              <button
                key={pageNum}
                type="button"
                className={`p-paginator-page p-link ${currentPage === pageNum ? 'p-highlight' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
                aria-label={`Page ${pageNum}`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            type="button"
            className="p-paginator-next p-link"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next Page"
          >
            <span className="p-paginator-icon pi pi-angle-right"></span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {headerContent}
      <DataTable
        value={artworks}
        rows={rowsPerPage}
        first={(currentPage - 1) * rowsPerPage}
        totalRecords={totalRecords}
        onPage={handlePageChange}
        selection={selectedRows}
        onSelectionChange={handleSelectionChange}
        dataKey="id"
        loading={loading}
        tableStyle={{ minWidth: '50rem' }}
        selectionMode="checkbox"
        emptyMessage="No artworks found."
        paginator={false}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        <Column field="title" header="Title" body={titleBodyTemplate} sortable />
        <Column field="place_of_origin" header="Place of Origin" body={placeBodyTemplate} sortable />
        <Column field="artist_display" header="Artist" body={artistBodyTemplate} sortable />
        <Column field="inscriptions" header="Inscriptions" body={inscriptionsBodyTemplate} />
        <Column field="date_start" header="Start Date" body={dateStartBodyTemplate} sortable />
        <Column field="date_end" header="End Date" body={dateEndBodyTemplate} sortable />
      </DataTable>
      
      {paginatorFooter()}

      <OverlayPanel ref={overlayRef} target={buttonRef.current} dismissable>
        <div style={{ padding: '1.5rem', minWidth: '400px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Select Multiple Rows</h3>
          <p style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
            Enter number of rows to select across all pages
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <InputNumber
              id="selectCount"
              value={selectCount}
              onValueChange={(e) => setSelectCount(e.value)}
              min={0}
              showButtons
              style={{ flex: 1 }}
              placeholder="e.g., 2"
            />
            <Button 
              label="Select" 
              onClick={handleCustomSelection}
            />
          </div>
        </div>
      </OverlayPanel>
    </div>
  );
}

export default App;
