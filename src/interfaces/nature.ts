export interface User {
  id: string;
  nickname: string;
}

export interface Device {
  id: string;
  name: string;
  temperature_offset: number;
  humidity_offset: number;
  created_at: Date;
  updated_at: Date;
  firmware_version: string;
  mac_address: string;
  serial_number: string;
  newest_events: {
    te?: {
      val: number;
      created_at: Date;
    };
    hu?: {
      val: number;
      created_at: Date;
    };
    il?: {
      val: number;
      created_at: Date;
    };
    mo?: {
      val: number;
      created_at: Date;
    };
  };
}

export interface Appliance {
  id: string;
  device: {
    id: string;
    name: string;
    temperature_offset: number;
    humidity_offset: number;
    created_at: Date;
    updated_at: Date;
    firmware_version: string;
    mac_address: string;
    serial_number: string;
  };
  model: {
    id: string;
    manufacturer: string;
    remote_name: string;
    name: string;
    image: string;
  };
  nickname: string;
  image: string;
  type: string;
  settings: {
    temp: string;
    mode: string;
    vol: string;
    dir: string;
    button: string;
  };
  aircon: {
    range: {
      modes: {
        cool: {
          temp: string[];
          vol: string[];
          dir: string[];
        };
        warm: {
          temp: string[];
          vol: string[];
          dir: string[];
        };
        dry: {
          temp: string[];
          vol: string[];
          dir: string[];
        };
        blow: {
          temp: string[];
          vol: string[];
          dir: string[];
        };
        auto: {
          temp: string[];
          vol: string[];
          dir: string[];
        };
      };
      fixedButtons: string[];
    };
    tempUnit: string;
  };
  signals: {
    id: string;
    name: string;
    image: string;
  }[];
  tv: {
    state: {
      input: string;
    };
    buttons: {
      name: string;
      image: string;
      label: string;
    }[];
  };
  light: {
    state: {
      brightness: string;
      power: string;
      last_button: string;
    };
    buttons: {
      name: string;
      image: string;
      label: string;
    }[];
  };
  smart_meter: {
    echonetlite_properties: {
      name: string;
      epc: number;
      val: string;
      updated_at: Date;
    }[];
  };
}
