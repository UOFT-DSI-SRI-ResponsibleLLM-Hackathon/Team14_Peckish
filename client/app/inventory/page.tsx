'use client';
import { useState, ChangeEvent, useEffect } from 'react';
import Navbar from '../components/navbar';
import { InventoryItem } from '../models/models';
import React from 'react';

// TODO: anytime when save is clicked, make call to API and send info to backend
export default function Page() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [newRow, setNewRow] = useState<Partial<InventoryItem> | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState<Set<number>>(new Set());

  const [isAddRow, setIsAddRow] = useState(true);
  const [newItem, setNewItem] = useState<string>('');

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/item`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: InventoryItem[] = (await response.json()).map((item: any) => ({
          id: item._id, // Assuming the backend returns _id
          name: item.name,
          icon: item.icon,
          expiry: item.expiry ? new Date(item.expiry).toISOString().split('T')[0] : '', // Format the date
          tags: item.tags,
          count: item.count,
        }));
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    attribute: keyof InventoryItem,
  ) => {
    const newData = [...data];
    newData[rowIndex][attribute] = e.target.value;
    setData(newData);
  };

  const handleApplyChanges = async () => {
    try {
      const promises = data.map((item) =>
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/item/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        }),
      );
      await Promise.all(promises);
      alert('Changes applied successfully');
    } catch (error) {
      console.error('Error applying changes:', error);
    }
  };

  const handleAddNew = () => {
    if (isAddRow) {
      setNewRow({
        name: '',
        icon: '',
        expiry: '',
        tags: [],
        count: '',
      });
    } else {
      handleSaveNewRow();
    }
    setIsAddRow((prev) => !prev);
  };

  const handleNewRowChange = (e: ChangeEvent<HTMLInputElement>, attribute: keyof InventoryItem) => {
    if (newRow) {
      setNewRow({ ...newRow, [attribute]: e.target.value });
    }
  };

  const handleSaveNewRow = async () => {
    if (newRow) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/item`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newRow),
        });
        if (!response.ok) {
          throw new Error('Failed to save new item');
        }
        const savedItem = await response.json();
        // Format the expiry date before updating the state
        const { _id, __v, ...correctItem } = savedItem;
        const formattedItem = {
          ...correctItem,
          expiry: correctItem.expiry
            ? new Date(correctItem.expiry).toISOString().split('T')[0]
            : '',
        };
        setData([...data, formattedItem]);
        setNewRow(null);
      } catch (error) {
        console.error('Error saving new item:', error);
      }
    }
  };

  const handleDeleteModeToggle = () => {
    setIsDeleteMode(!isDeleteMode);
    setRowsToDelete(new Set());
  };

  const handleRowSelectToggle = (rowIndex: number) => {
    const newRowsToDelete = new Set(rowsToDelete);
    if (newRowsToDelete.has(rowIndex)) {
      newRowsToDelete.delete(rowIndex);
    } else {
      newRowsToDelete.add(rowIndex);
    }
    setRowsToDelete(newRowsToDelete);
  };

  const handleDeleteSelectedRows = async () => {
    try {
      const promises = Array.from(rowsToDelete).map((rowIndex) =>
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/item/${data[rowIndex].id}`, {
          method: 'DELETE',
        }),
      );
      await Promise.all(promises);
      const newData = data.filter((_, index) => !rowsToDelete.has(index));
      setData(newData);
      setIsDeleteMode(false);
      setRowsToDelete(new Set());
      alert('Selected rows deleted successfully');
    } catch (error) {
      console.error('Error deleting selected rows:', error);
    }
  };

  const handleCancelNewRow = () => {
    setNewRow(null);
  };

  const handleMagicAdd = () => {
    console.log('Handle Magic Add', newItem);
    // TODO: call API here
    // grab the response and add it to the data
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start margins">
      <h1>Inventory</h1>
      <table className="w-full table-auto bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-orange-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left"></th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Icon</th>
            <th className="py-3 px-6 text-left">Expiry Date</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Count</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-b border-gray-200 ${
                isDeleteMode && rowsToDelete.has(rowIndex)
                  ? 'bg-orange-300 hover:bg-orange-400'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => isDeleteMode && handleRowSelectToggle(rowIndex)}
            >
              <td className="py-3 px-6 text-left">
                {isDeleteMode && (
                  <input
                    type="checkbox"
                    checked={rowsToDelete.has(rowIndex)}
                    onChange={() => handleRowSelectToggle(rowIndex)}
                  />
                )}
              </td>
              {Object.keys(row)
                .filter((attribute) => attribute !== 'id') // Exclude the 'id' attribute
                .map((attribute) => (
                  <td key={attribute} className="py-3 px-6 text-left">
                    <input
                      type={attribute === 'expiry' ? 'date' : 'text'}
                      value={row[attribute as keyof InventoryItem]}
                      onChange={(e) =>
                        handleInputChange(e, rowIndex, attribute as keyof InventoryItem)
                      }
                      className="bg-transparent"
                      style={{
                        width: '150px',
                        // backgroundColor:
                        //   isDeleteMode && rowsToDelete.has(rowIndex) ? 'red' : 'white',
                      }} // Adjust the width as needed
                      readOnly={isDeleteMode}
                    />
                  </td>
                ))}
            </tr>
          ))}
          {newRow && (
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left"></td>
              {Object.keys(newRow)
                .filter((attribute) => attribute !== 'id') // Exclude the 'id' attribute
                .map((attribute) => (
                  <td key={attribute} className="py-3 px-6 text-left">
                    <input
                      type={attribute === 'expiry' ? 'date' : 'text'}
                      value={newRow[attribute as keyof InventoryItem] || ''} // Ensure value is a string
                      onChange={(e) => handleNewRowChange(e, attribute as keyof InventoryItem)}
                      style={{ width: '150px' }} // Adjust the width as needed
                    />
                  </td>
                ))}
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex flex-row justify-center gap-4 mt-5 w-full">
        <div className="relative w-[300px]">
          <input
            type="text"
            placeholder="Type an Item"
            className="input-box w-full pr-10"
            onChange={(event) => setNewItem(event.target.value)}
            onKeyDown={(event) => (event.key === 'Enter' ? handleMagicAdd() : null)}
            value={newItem}
          />
          <button
            className="absolute right-0 top-0 h-full px-4 bg-orange-500 text-white rounded-tl-none rounded-tr-md rounded-bl-none rounded-br-md"
            onClick={handleMagicAdd}
          >
            Add New
          </button>
        </div>

        {/* <button onClick={handleAddNew} className="btn-orange-outline mr-4">
          {isAddRow ? 'Add New' : 'Save New'}
        </button> */}
        <button onClick={handleApplyChanges} className="btn-orange">
          Apply
        </button>
        <button
          onClick={isDeleteMode ? handleDeleteSelectedRows : handleDeleteModeToggle}
          className="btn-orange"
        >
          {isDeleteMode ? 'Confirm' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
