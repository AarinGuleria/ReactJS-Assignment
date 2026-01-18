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
  }, [artworks, selectedIds]);

  const handlePageChange = (event: any) => {
    // PrimeReact paginator uses 0-based page index, API uses 1-based
    const pageIndex = event.page ?? 0;
    setCurrentPage(pageIndex + 1);
  };

  const handleSelectionChange = (e: any) => {
    const newlySelected = e.value as Artwork[];
    const updatedIds = new Set(selectedIds);
    const currentPageIds = new Set(artworks.map(a => a.id));
    const previouslySelectedOnPage = artworks.filter(item => selectedIds.has(item.id));
    
    // Check if user is deselecting (newlySelected has fewer items than previously selected on this page)
    const isDeselecting = newlySelected.length < previouslySelectedOnPage.length;
    
    // Clear selections for current page items first
    currentPageIds.forEach(id => updatedIds.delete(id));
    
    // If user is deselecting, don't add any items from current page back
    // This ensures all checkboxes on current page are deselected
    // Otherwise, add the newly selected items
    if (!isDeselecting) {
      newlySelected.forEach(item => {
        updatedIds.add(item.id);
      });
    }
    
    setSelectedIds(updatedIds);
    
    // If user deselects and we have a target count, update to show actual count
    if (targetSelectionCount > 0) {
      const actualCount = updatedIds.size;
      
      // If actual count is less than target, show actual count
      // This happens when user deselects checkboxes
      if (actualCount < targetSelectionCount) {
        setTargetSelectionCount(0);
      }
    }
  };

  const handleCustomSelection = async () => {
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
    let currentPageNum = 1;
    let hasMoreData = true;

    // Start selecting from page 1, not current page
    while (selectedCount < targetCount && hasMoreData) {
      try {
        // Fetch artworks for current page
        const response = await fetchArtworks(currentPageNum);
        const pageArtworks = response.data;
        
        if (pageArtworks.length === 0) {
          hasMoreData = false;
          break;
        }

        // Select rows from this page
        for (const artwork of pageArtworks) {
          if (selectedCount >= targetCount) {
            break;
          }
          
          updatedSelection.add(artwork.id);
          selectedCount++;
        }

        // Move to next page if we need more selections
        if (selectedCount < targetCount) {
          currentPageNum++;
          // Check if we've exceeded total records
          if (currentPageNum > Math.ceil(response.pagination.total / rowsPerPage)) {
            hasMoreData = false;
          }
        }
      } catch (error) {
        console.error('Failed to load artworks for selection:', error);
        hasMoreData = false;
      }
    }
    
    // Update selection state immediately
    setSelectedIds(updatedSelection);
    
    // Reload current page to reflect selections
    await loadArtworks(currentPage);
    
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

      <OverlayPanel ref={overlayRef} dismissable>
        <div style={{ padding: '1.5rem', minWidth: '400px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Select Multiple Rows</h3>
          <p style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
            Enter number of rows to select across all pages
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <InputNumber
              id="selectCount"
              value={selectCount}
              onValueChange={(e) => setSelectCount(e.value ?? null)}
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
