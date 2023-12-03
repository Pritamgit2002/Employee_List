// Pro.tsx
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { GrCaretPrevious, GrChapterPrevious } from "react-icons/gr";
import { GrChapterNext, GrCaretNext } from "react-icons/gr";
import { CiCircleCheck } from "react-icons/ci";
import { RxCrossCircled } from "react-icons/rx";

import React, { useState, useEffect } from "react";

type MemberType = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const Pro: React.FC = () => {
  const [members, setMembers] = useState<MemberType[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>("");
  const [editedEmail, setEditedEmail] = useState<string>("");
  const [editedRole, setEditedRole] = useState<string>("");
  const [selectedMemberId, setSelectedMemberId] = useState<string>(""); // Add this line

  const itemsPerPage = 10;
  const totalPages = Math.ceil(members.length / itemsPerPage);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log(data);
        setMembers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to handle row selection
  const handleRowSelect = (id: string) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Function to handle delete action
  const handleDelete = (id: string) => {
    // Implement your delete logic here
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );
    if (!confirmDelete) {
      return;
    }

    // Remove the member with the given id from the members state
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== id)
    );

    // Deselect the deleted row
    setSelectedRows((prevSelected) =>
      prevSelected.filter((rowId) => rowId !== id)
    );
  };

  // Function to handle edit action
  //   const handleEdit = (id: string) => {
  //     // Implement your edit logic here
  //     const memberToEdit = members.find((member) => member.id === id);

  //     if (!memberToEdit) {
  //       console.error(`Member with ID ${id} not found.`);
  //       return;
  //     }

  //     // Prompt the user for updated information
  //     const newName = prompt("Enter new name:", memberToEdit.name);
  //     const newEmail = prompt("Enter new email:", memberToEdit.email);
  //     const newRole = prompt("Enter new role:", memberToEdit.role);

  //     // If the user cancels, do nothing
  //     if (newName === null || newEmail === null || newRole === null) {
  //       return;
  //     }

  //     // Update the members state with the edited information
  //     setMembers((prevMembers) =>
  //       prevMembers.map((member) =>
  //         member.id === id
  //           ? { ...member, name: newName, email: newEmail, role: newRole }
  //           : member
  //       )
  //     );
  //   };

  const handleEdit = (id: string) => {
    const memberToEdit = members.find((member) => member.id === id);

    if (!memberToEdit) {
      console.error(`Member with ID ${id} not found.`);
      return;
    }

    // Set initial values for the dialog
    setEditedName("");
    setEditedEmail("");
    setEditedRole("");
    setSelectedMemberId(id);

    // Open the dialog
    setShowEditDialog(true);
  };

  const handleEditDialogClose = () => {
    // Close the dialog
    setShowEditDialog(false);
  };

  const handleSaveEdit = () => {
    // Update the members state with the edited information
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === selectedMemberId
          ? {
              ...member,
              name: editedName,
              email: editedEmail,
              role: editedRole,
            }
          : member
      )
    );

    // Close the dialog
    setShowEditDialog(false);
  };

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    // Implement your search logic here
    setSearchQuery(query);
    setCurrentPage(1); // Reset to the first page when performing a new search
  };

  // Function to handle key press events
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e.currentTarget.value);
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteSelected = () => {
    // Confirm before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected rows?"
    );
    if (!confirmDelete) {
      return;
    }

    // Filter out the selected rows and update the members state
    setMembers((prevMembers) =>
      prevMembers.filter((member) => !selectedRows.includes(member.id))
    );

    // Clear the selected rows
    setSelectedRows([]);
  };

  return (
    <div className="flex flex-col relative sm:mx-28 sm:p-10  gap-y-16">
      {/* head */}
      <div className="bg--200 w-max mx-auto sm:mx-0 sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-y-5 sm:gap-y-0 justify-normal sm:justify-between">
        <div className="flex items-center justify-center gap-8">
          <input
            type="text"
            placeholder="Search By Name...."
            className="border p-2 text-black sm:w-96 rounded-xl"
            onChange={(e) => handleSearch(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="bg-blue-500 text-white p-2 text-xl  ml-2 rounded-xl font-semibold"
            onClick={() => handleSearch(searchQuery)}
          >
            Search
          </button>
        </div>
        <button
          className={`p-2 rounded-lg whitespace-nowrap sm:text-xl font-semibold  ${
            selectedRows.length > 0
              ? "bg-red-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          onClick={handleDeleteSelected}
          disabled={selectedRows.length === 0}
        >
          Delete Selected
        </button>
      </div>

      {/* list contain & header */}
      <div className="w-full h-fit flex flex-col  bg--200">
        {/* Table Header */}
        <div className="w-full bg-red-300 flex items-center justify-between px-3 sm:px-20">
          <div className="bg--400">
            <input
              type="checkbox"
              onChange={() => {
                const allRows = members.slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                );
                const allIds = allRows.map((row) => row.id);
                if (selectedRows.length === allIds.length) {
                  setSelectedRows([]);
                } else {
                  setSelectedRows(allIds);
                }
              }}
              checked={
                selectedRows.length ===
                members
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((row) => row.id).length
              }
            />
          </div>
          <div className="sm:text-3xl font-bold uppercase w-20 bg--300 text-center">
            Name
          </div>
          <div className="sm:text-3xl font-bold uppercase w-20 bg--300 text-center">
            Email
          </div>
          <div className="sm:text-3xl font-bold uppercase w-20 bg--300 text-center">
            Role
          </div>
          <div className="sm:text-3xl font-bold uppercase w-20 bg--300 text-center">
            Actions
          </div>
        </div>
        {/* Table Body */}
        <div className=" flex flex-col gap-y-10 mt-10  items-center justify-between px-3 sm:px-10 ">
          {members
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((member) => (
              <div
                key={member.id}
                className={`flex items-center justify-between w-full text-center p-3 border border-white rounded-xl shadow-sm shadow-neutral-300 bg--200  ${
                  selectedRows.includes(member.id) ? "bg-gray-700" : ""
                }`}
              >
                <div className="inline-block sm:hidden">
                  <input
                    type="checkbox"
                    onChange={() => handleRowSelect(member.id)}
                    checked={selectedRows.includes(member.id)}
                  />
                </div>
                <div className="bg--100/40 flex flex-col sm:flex-row w-full items-center justify-between sm:gap-40 ">
                  <div className="flex flex-col sm:flex-row sm:w-full bg--200 items-center sm:justify-between ">
                    <div className="hidden sm:inline-block">
                      <input
                        type="checkbox"
                        onChange={() => handleRowSelect(member.id)}
                        checked={selectedRows.includes(member.id)}
                      />
                    </div>
                    {/* <div className="w-full flex  items-center justify-between"> */}
                    <div className="sm:text-xl font-semibold bg--300 sm:w-40">
                      {member.name}
                    </div>
                    <div className="sm:text-xl font-semibold bg--300 sm:w-40">
                      {member.email}
                    </div>
                    <div className="bg--400 sm:px-10 sm:text-xl font-semibold bg--300 sm:w-40">
                      {member.role}
                    </div>
                    {/* </div> */}
                  </div>
                  <div className=" sm:flex bg-200  gap-2 items-center justify-center sm:w-40 hidden ">
                    <button
                      className="text-4xl text-yellow-400 hover:scale-110 duration-300 ease-in-out "
                      onClick={() => handleEdit(member.id)}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="text-4xl text-red-400 hover:scale-110 duration-300 ease-in-out "
                      onClick={() => handleDelete(member.id)}
                    >
                      <MdDeleteForever />
                    </button>
                  </div>
                </div>

                <div className="sm:hidden flex flex-row bg--200  gap-2 items-center justify-center">
                  <button
                    className="text-4xl text-yellow-400 hover:scale-110 duration-300 ease-in-out "
                    onClick={() => handleEdit(member.id)}
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    className="text-4xl text-red-400 hover:scale-110 duration-300 ease-in-out "
                    onClick={() => handleDelete(member.id)}
                  >
                    <MdDeleteForever />
                  </button>
                </div>
              </div>
            ))}
        </div>
        {/* Pagination */}
        <div className="  inset-x-0 bottom-0 w-full bg--100/50 flex items-center justify-center mx-auto py-10 sm:py-4 ">
          <button
            className={`text-black text-xl font-bold rounded-lg p-2 ml-2 ${
              currentPage === 1 ? "bg-gray-400" : "bg-white"
            }`}
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <GrChapterPrevious />
          </button>
          <button
            className={`text-black text-xl font-bold rounded-lg p-2 ml-2 ${
              currentPage === 1 ? "bg-gray-400" : "bg-white"
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <GrCaretPrevious />
          </button>
          &nbsp;<span>{` Page ${currentPage} of ${totalPages}`}</span>
          <button
            className={`text-black text-xl font-bold rounded-lg p-2 ml-2 ${
              currentPage === totalPages ? "bg-gray-400" : "bg-white"
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <GrCaretNext />
          </button>
          <button
            className={`
            text-black text-xl font-bold rounded-lg p-2 ml-2 ${
              currentPage === totalPages ? "bg-gray-400" : "bg-white"
            }`}
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <GrChapterNext />
          </button>
        </div>
      </div>

      {/* serach */}

      {/* {searchQuery && (
        <div className="fixed bottom-0 left-0 bg-blue-500 text-white p-4">
          <h3>Search Results:</h3>
          <ul>
            {filteredMembers.map((member) => (
              <li
                key={member.id}
              >{`${member.name} - ${member.email} - ${member.role}`}</li>
            ))}
          </ul>
        </div>
      )} */}

      {/* edit dialoge */}
      {showEditDialog && (
        <div className="fixed flex flex-col gap-y-4 justify- text-black top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black border-4 border-gray-400 shadow-gray-400 max-w-fit p-4 sm:p-8 rounded-lg shadow-lg">
          <div className=" text-[25px] sm:text-[40px] font-semibold text-neutral-100">
            Edit Member
          </div>
          <div className="flex gap-3 items-center justify-start text-2xl font-semibold ">
            <span className="bg--200 w-20 text-neutral-100">Name:</span>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="px-2 sm:py-1 font-normal rounded-lg focus:border-[3px] border-gray-400 w-64 sm:w-80 "
            />
          </div>
          <div className="flex gap-3 items-center justify-start text-2xl font-semibold ">
            <span className="bg--200 w-20 text-neutral-100">Email:</span>
            <input
              type="text"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="px-2 sm:py-1 font-normal rounded-lg focus:border-[3px] border-gray-400 w-64 sm:w-80 "
            />
          </div>
          <div className="flex gap-3 items-center justify-start text-2xl font-semibold  ">
            <span className="bg--200 w-20 text-neutral-100">Role:</span>

            <input
              type="text"
              value={editedRole}
              onChange={(e) => setEditedRole(e.target.value)}
              className="px-2 sm:py-1 font-normal rounded-lg focus:border-[3px] border-gray-400 w-64 sm:w-80 "
            />
          </div>

          <button
            onClick={handleSaveEdit}
            className="w-full bg-green-400 text-white text-xl font-semibold p-1 rounded-lg flex items-center justify-center gap-3"
          >
            <div className="text-3xl font-extrabold">
              <CiCircleCheck />
            </div>
            <span>SAVE</span>
          </button>
          <button
            onClick={handleEditDialogClose}
            className="w-full bg-red-400 text-white text-xl font-semibold p-1 rounded-lg flex items-center justify-center gap-3"
          >
            <div className="text-3xl font-extrabold">
              <RxCrossCircled />
            </div>
            <span>CA</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Pro;
