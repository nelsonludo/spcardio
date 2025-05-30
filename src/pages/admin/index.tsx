// import { useProjectStore } from '../../stores/projectStore';

import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { AppProvider, type Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import DashboardContent from "./contents/DashboardContent";
import EnseignantsContent from "./contents/EnseignantsContent";
import LaureatsContent from "./contents/LaureatsContent";
import EtudiantsContent from "./contents/EtudiantsContent";

import { FaSchool, FaUserGraduate, FaUserNurse } from "react-icons/fa";
import { NiveauEtudiants, UserRoles } from "../../types/enums/actors-types";
import CoursTheoriquesContent from "./contents/CoursTheoriqueContent";
import { useNavigate } from "react-router-dom";
import DiscussionForum from "./contents/EspaceCollaboratifContent";
import ListesMemoiresContent from "./contents/ListesDeMemoiresContent";
import ListesThesesContent from "./contents/ListesDeThesesContent";
import RapportsAdministratifContent from "./contents/RapportAdministratifContent";
import { useEffect, useMemo } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useLogout } from "../../api/AuthApi";

import { useEnseignementsStore } from "../../stores/enseignementsStore";
import {
  useGetAPTypes,
  useGetEnseignements,
  useGetProgrammes,
} from "../../api/EnseignementsApi";
import SuiviContent from "./contents/suiviContent";
import ProgrammesContent from "./contents/ProgrammesContent";
import { useGetEtudiants } from "../../api/EtudiantsApi";
import { useGetEnseignants } from "../../api/EnseignantsApi";

export default function TableauDeBord() {
  const { user } = useAuthStore();
  const { logOutUser } = useLogout();
  const { getAPTypes } = useGetAPTypes();
  const { getProgrammes } = useGetProgrammes();

  const { programmes, APTypes } = useEnseignementsStore();
  const navigate = useNavigate();

  const { getEnseignants } = useGetEnseignants();
  const { getEnseignements } = useGetEnseignements();
  const { getEtudiants } = useGetEtudiants();

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        getEnseignements(),
        getAPTypes(),
        getProgrammes(),
        getEnseignants(),
      ]);
    };
    fetchInitialData();
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    if (user?.role === UserRoles.ADMIN) {
      Promise.all([getEtudiants()]);
    }
  }, [user]); // Empty dependency array ensures this runs once on mount

  const publicNavigation = [
    {
      segment: "programmes",
      title: "Programmes",
      icon: <FaUserGraduate />,
    },
    {
      segment: "programmationActivitesPedagogiques",
      title: "Programmation",
      icon: <DashboardIcon />,
      children: APTypes?.map((APType) => {
        const APTypeChild = {
          segment: APType?.code,
          title: APType?.titre,
          icon: <DashboardIcon />,
          children: programmes?.map((programme) => {
            const programmeChild = {
              segment: programme?.title.split(" ").join("").toLowerCase(),
              title: programme?.title,
              icon: <FaSchool />,
            };
            return programmeChild;
          }),
        };
        return APTypeChild;
      }),
    },
    {
      segment: "suiviActivitesPedagogiques",
      title: "Suivi",
      icon: <DashboardIcon />,
      children: programmes?.map((programme) => {
        const programmeChild = {
          segment: programme?.title.split(" ").join("").toLowerCase(),
          title: programme?.title,
          icon: <FaSchool />,
        };
        return programmeChild;
      }),
    },

    {
      segment: "espaceCollaboratif",
      title: "Espace Collaboratif",
      icon: <DashboardIcon />,
    },
    {
      segment: "documentation",
      title: "Documentation",
      icon: <DashboardIcon />,
      children: [
        {
          segment: "listeDeTheses",
          title: "Liste De Thèses",
          icon: <DashboardIcon />,
        },
        {
          segment: "listeDeMemoires",
          title: "Liste De Mémoires",
          icon: <DashboardIcon />,
        },
        {
          segment: "rapportsAdministratifsFinancier",
          title: "Rapports Administratifs et Financier",
          icon: <DashboardIcon />,
        },
      ],
    },
  ];

  const adminNavigation = [
    {
      segment: "dashboard",
      title: "Tableau de bord",
      icon: <DashboardIcon />,
    },
    {
      segment: "enseignants",
      title: "Enseignants",
      icon: <FaUserGraduate />,
    },
    {
      segment: "etudiants",
      title: "Etudiants",
      icon: <FaUserNurse />,
      children: programmes?.map((programme) => {
        const programmeChild = {
          segment: programme?.title.split(" ").join("").toLowerCase(),
          title: programme?.title,
          icon: <FaSchool />,
        };
        return programmeChild;
      }),
    },
    {
      segment: "laureats",
      title: "Laureats",
      icon: <FaUserGraduate />,
    },
  ];
  const NAVIGATION: Navigation =
    user?.role === UserRoles.ADMIN
      ? [...adminNavigation, ...publicNavigation]
      : [...publicNavigation];

  type I3SBrandType = {
    title?: string;
    logo?: React.ReactNode;
    homeUrl?: string;
  };
  const I3SBrand: I3SBrandType = {
    title: "SPCARDIO.",
    logo: (
      <button onClick={() => navigate("/home")}>
        <img
          src="/images/uniYaounde1Logo.png"
          alt={""}
          className="rounded-full "
        />
      </button>
    ),
  };

  const demoTheme = createTheme({
    cssVariables: {
      colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: "rgb(25, 118, 210)", // Added primary color
          },

          background: {
            default: "#eefff4",
            paper: "#c7ebd3",
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: "#90caf9", // Added primary color for dark mode
          },
          background: {
            default: "#2A4364",
            paper: "#112E4D",
          },
          text: {
            primary: "#c9c9c9", // Changed from black to white for better contrast
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600, // Note: md and sm have same value - is this intentional?
        lg: 1200,
        xl: 1536,
      },
    },
  });
  function DemoPageContent({ pathname }: { pathname: string }) {
    let content: React.ReactNode;
    let title: string;

    // Extract path segments dynamically
    const pathSegments = pathname.split("/").filter(Boolean); // Remove empty segments

    const apTypeSegment = pathSegments[1]; // Dynamic APType (e.g., "coursTheoriques")
    const niveauSegment =
      pathSegments[2]?.toLowerCase() || pathSegments[1]?.toLowerCase(); // Dynamic Niveau (e.g., "niveau1")

    // Static pages mapping
    const pageMap: Record<string, { content: React.ReactNode; title: string }> =
      {
        enseignants: {
          content: <EnseignantsContent />,
          title: "Liste des Enseignants",
        },
        programmes: {
          content: <ProgrammesContent />,
          title: "Programme",
        },
        espaceCollaboratif: {
          content: <DiscussionForum />,
          title: "Espace Collaboratif",
        },
        laureats: { content: <LaureatsContent />, title: "Liste des Laureats" },
        "documentation/listeDeMemoires": {
          content: <ListesMemoiresContent />,
          title: "Liste De Mémoires",
        },
        "documentation/listeDeTheses": {
          content: <ListesThesesContent />,
          title: "Liste De Thèses",
        },
        "documentation/rapportsAdministratifsFinancier": {
          content: <RapportsAdministratifContent />,
          title: "Rapports Administratif et Financiers",
        },
      };

    // Dynamic APType and Niveau mapping
    const niveauMap: Record<string, NiveauEtudiants> = {
      niveau1: NiveauEtudiants.NiVEAU1,
      niveau2: NiveauEtudiants.NiVEAU2,
      niveau3: NiveauEtudiants.NiVEAU3,
      niveau4: NiveauEtudiants.NiVEAU4,
    };

    // Check if the pathname follows the pattern "/suivi/:niveau"
    if (
      pathSegments[0] === "suiviActivitesPedagogiques" &&
      niveauSegment in niveauMap
    ) {
      content = <SuiviContent niveau={niveauMap[niveauSegment]} />;
      title = `Suivi de ${niveauSegment.replace("niveau", "Niveau ")}`;
    }

    // Check if the pathname follows the pattern "/programmesActivitesPedagogiques/:APType/:niveau"
    else if (
      pathSegments[0] === "programmationActivitesPedagogiques" &&
      apTypeSegment &&
      niveauSegment in niveauMap
    ) {
      content = (
        <CoursTheoriquesContent
          niveau={niveauMap[niveauSegment]}
          apType={apTypeSegment}
        />
      );
      title = `Programmation de ${apTypeSegment.replace(/([A-Z])/g, " $1").trim()} ${niveauSegment.replace("niveau", "Niveau ")}`;
    }

    // Handle student levels dynamically
    else if (pathSegments[0] === "etudiants" && niveauSegment in niveauMap) {
      content = <EtudiantsContent niveau={niveauMap[niveauSegment]} />;
      title = `Liste des étudiants du ${niveauSegment.replace("niveau", "Niveau ")}`;
    }
    // Handle predefined static paths
    else if (pageMap[pathSegments[0]]) {
      content = pageMap[pathSegments[0]].content;
      title = pageMap[pathSegments[0]].title;
    }
    // Default case
    else {
      content = <DashboardContent />;
      title = "Tableau de bord";
    }

    return (
      <Box
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <span className="text-2xl text-blue-700 font-bold">
          {title.toUpperCase()}
        </span>
        {content}
      </Box>
    );
  }

  const authentication = useMemo(() => {
    return {
      signIn: () => {},
      signOut: () => {
        logOutUser();
      },
    };
  }, []);
  const router = useDemoRouter("/dashboard");

  return (
    // preview-start
    <AppProvider
      session={
        user
          ? {
              user: {
                ...user,
                id: user.id.toString(), // Convert number to string
              },
            }
          : null
      }
      authentication={authentication}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      branding={I3SBrand}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}
