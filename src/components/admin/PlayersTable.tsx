import React from 'react';
import DataTable from '../ui/DataTable.tsx';
import { useToastSuccess, useToastError } from '../ui/ToastContext.tsx';

interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  price: number;
  healthStatus: string;
}

const sampleData: Player[] = [
  { id: 1, name: "Robert Lewandowski", team: "FC Barcelona", position: "FWD", price: 12.5, healthStatus: "Pewny" },
  { id: 2, name: "Karim Benzema", team: "Real Madrid", position: "FWD", price: 11.8, healthStatus: "Wątpliwy" },
  { id: 3, name: "Kylian Mbappé", team: "PSG", position: "FWD", price: 13.2, healthStatus: "Pewny" },
  { id: 4, name: "Lionel Messi", team: "Inter Miami", position: "FWD", price: 12.9, healthStatus: "Pewny" },
  { id: 5, name: "Erling Haaland", team: "Manchester City", position: "FWD", price: 13.5, healthStatus: "Nie zagra" }
];

export default function PlayersTable() {
  const showSuccessToast = useToastSuccess();
  const showErrorToast = useToastError();

  const handleEdit = (player: Player) => {
    showSuccessToast(
      'Edit Player',
      `${player.name} edit form opened`,
      3000
    );
    console.log("Edit player:", player);
  };

  const handleDelete = (player: Player) => {
    showErrorToast(
      'Delete Player',
      `Are you sure you want to delete ${player.name}? This action cannot be undone.`,
      5000
    );
    console.log("Delete player:", player);
  };

  return (
    <DataTable
      data={sampleData}
      columns={[
        { key: "name", header: "Player", sortable: true, render: (value, item) => `${value} (${item.team})` },
        { key: "position", header: "Position", sortable: true },
        { key: "price", header: "Price (M)", sortable: true, render: (value) => `£${value}M` },
        { key: "healthStatus", header: "Status", sortable: true, render: (value) => {
          const colors: Record<string, string> = {
            "Pewny": "text-green-600 bg-green-100",
            "Wątpliwy": "text-yellow-600 bg-yellow-100",
            "Nie zagra": "text-red-600 bg-red-100"
          };
          return `<span class="px-2 py-1 text-xs font-medium rounded-full ${colors[String(value)] || 'text-gray-600 bg-gray-100'}">${value}</span>`;
        }}
      ]}
      actions={[
        {
          label: "Edit",
          onClick: handleEdit,
          variant: "primary",
          icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>`
        },
        {
          label: "Delete",
          onClick: handleDelete,
          variant: "danger",
          icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`
        }
      ]}
      searchPlaceholder="Search players..."
      itemsPerPage={10}
    />
  );
}
