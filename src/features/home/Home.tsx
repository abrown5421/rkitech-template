import React from "react";
import { Button, Container } from "rkitech-components";
import { useAppDispatch } from "../../app/hooks";
import { openAlert } from "../../features/alert/alertSlice";
import { openModal } from "../../features/modal/modalSlice";
import { openDrawer } from "../../features/drawer/drawerSlice";
import type { HomeProps } from "./homeTypes";

const Home: React.FC<HomeProps> = () => {
  const dispatch = useAppDispatch();

  const handleAlert = () => {
    dispatch(
      openAlert({
        body: "This is an alert!",
        closeable: true,
        color: "red",
        intensity: 500,
        textColor: "gray",
        textIntensity: 50,
      })
    );
  };

  const handleModal = () => {
    dispatch(
      openModal({
        title: "Example Modal",
        body: "This is the modal body text.",
        closeable: true,
        action: [
          {
            actionName: "Close",
            actionColor: "blue",
            actionIntensity: 500,
            actionTextColor: "gray",
            actionTextIntensity: 50,
            actionFunction: () => dispatch(openModal({ title: "", body: "", closeable: true, action: [] })),
          },
        ],
      })
    );
  };

  const handleDrawer = () => {
    dispatch(
      openDrawer({
        title: "Example Drawer",
        color: "yellow",
        intensity: 400,
        orientation: "right",
        action: [
          {
            actionName: "Close Drawer",
            actionColor: "red",
            actionIntensity: 500,
            actionFunction: () => dispatch(openDrawer({ title: "", action: [] })),
          },
        ],
      })
    );
  };

  return (
    <Container tailwindClasses="w-full min-h-[calc(100vh-50px)] p-5 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Home</h1>
      <Button tailwindClasses='m-5 bg-amber-500 text-white border-2 border-amber-500 py-1 px-4 rounded-xl cursor-pointer hover:text-amber-500 hover:bg-transparent' onClick={handleAlert} >
        Open Alert
      </Button>
      <Button tailwindClasses='m-5 bg-amber-500 text-white border-2 border-amber-500 py-1 px-4 rounded-xl cursor-pointer hover:text-amber-500 hover:bg-transparent' onClick={handleModal} >
        Open Modal
      </Button>
      <Button tailwindClasses='m-5 bg-amber-500 text-white border-2 border-amber-500 py-1 px-4 rounded-xl cursor-pointer hover:text-amber-500 hover:bg-transparent' onClick={handleDrawer} >
        Open Drawer
      </Button>
    </Container>
  );
};

export default Home;
