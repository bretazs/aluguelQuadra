
export type RootStackParamList = {
    Home: undefined;
    Agenda: {
      quadra: {
        id: string;
        nome_quadra: string;
        image_url?: string;
      };
      horario: {
        id: string;
        data_disponivel: string;
        horario: string;
        tipo: string;
      };
    };
    PreAgendamento: {
      quadra: any;
      horario: any;
    };
  };
  