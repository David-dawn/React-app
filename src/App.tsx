import React, { useState, useEffect } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectionMap, setSelectionMap] = useState<{ [key: number]: Artwork }>({}); // Track selections per page

  // Fetch Data from API
  const fetchData = (page: number = 1) => {
    setLoading(true);
    fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        const transformedData = data.data.map((artwork: any) => ({
          id: artwork.id, // Use id to uniquely identify rows
          title: artwork.title,
          place_of_origin: artwork.place_of_origin,
          artist_display: artwork.artist_display,
          inscriptions: artwork.inscriptions,
          date_start: artwork.date_start,
          date_end: artwork.date_end,
        }));
        setArtworks(transformedData);
        setTotalRecords(data.pagination.total);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(1); // Fetch the first page initially
  }, []);

  // Handle page changes (server-side pagination)
  const onPage = (event: DataTableStateEvent) => {
    const page = event.page !== undefined ? event.page + 1 : 1; // PrimeReact pagination is zero-based, add 1
    fetchData(page); // Fetch data for the new page
  };

  // Handle row selection and persist across page changes
  const onSelectionChange = (e: { value: Artwork[] }) => {
    const updatedSelection = { ...selectionMap };
    e.value.forEach((artwork) => {
      updatedSelection[artwork.id] = artwork; // Track selected items with their ID
    });
    setSelectionMap(updatedSelection);
  };

  // Persist row selections across pages
  const getPersistedSelection = () => {
    return artworks.filter((artwork) => selectionMap[artwork.id]); // Restore selection for the current page
  };

  // Remove a single artwork from the selection panel
  const removeSelectedArtwork = (artwork: Artwork) => {
    const updatedSelection = { ...selectionMap };
    delete updatedSelection[artwork.id]; // Remove from selection map
    setSelectionMap(updatedSelection);
  };

  return (
    <div className="datatable-demo">
      {/* PrimeReact DataTable with row selection */}
      <DataTable
        value={artworks}
        paginator
        rows={5}
        totalRecords={totalRecords}
        loading={loading}
        onPage={onPage}
        selection={getPersistedSelection()} // Get persisted selection for the current page
        onSelectionChange={onSelectionChange}
        selectionMode="checkbox"
      >
        <Column selectionMode="multiple"></Column>
        <Column field="title" header="Title"></Column>
        <Column field="place_of_origin" header="Place of Origin"></Column>
        <Column field="artist_display" header="Artist"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Date Start"></Column>
        <Column field="date_end" header="Date End"></Column>
      </DataTable>

      {/* Custom Row Selection Panel */}
      <div className="selection-panel" style={{ marginTop: '20px' }}>
        <h3>Selected Artworks</h3>
        {Object.values(selectionMap).length === 0 ? (
          <p>No artworks selected</p>
        ) : (
          <ul>
            {Object.values(selectionMap).map((artwork: Artwork) => (
              <li key={artwork.id}>
                {artwork.title} - {artwork.artist_display} 
                <Button
                  icon="pi pi-times"
                  className="p-button-rounded p-button-danger p-ml-2"
                  onClick={() => removeSelectedArtwork(artwork)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
