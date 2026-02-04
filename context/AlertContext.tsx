import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import Alert, { AlertButton } from "@/components/common/Alert";

interface AlertContextType {
    showAlert: (title: string, message?: string, buttons?: AlertButton[]) => void;
    hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [config, setConfig] = useState<{
        title: string;
        message?: string;
        buttons?: AlertButton[];
    }>({ title: "" });

    const hideAlert = useCallback(() => {
        setVisible(false);
    }, []);

    const showAlert = useCallback(
        (title: string, message?: string, buttons?: AlertButton[]) => {
            // If buttons are provided, we need to wrap their onPress handlers to close the alert
            const wrappedButtons = buttons?.map((btn) => ({
                ...btn,
                onPress: () => {
                    hideAlert(); // Close alert first
                    if (btn.onPress) btn.onPress(); // Then execute callback
                },
            }));

            // If no buttons, default OK button should also close alert
            const finalButtons = wrappedButtons && wrappedButtons.length > 0
                ? wrappedButtons
                : [{ text: "OK", onPress: hideAlert }];

            setConfig({ title, message, buttons: finalButtons });
            setVisible(true);
        },
        [hideAlert]
    );

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <Alert
                visible={visible}
                title={config.title}
                message={config.message}
                buttons={config.buttons}
                onClose={hideAlert}
            />
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};
