export type InformationProps = {
  information: string;
  onInformationChange: (value: string) => void;
};

export type DateRangeProps = {
  fromDate: Date;
  untilDate: Date;
  untilFurtherNotice: boolean;
  onDatePicker: (picker: 'from' | 'until') => void;
  onUntilFurtherNoticeChange: (checked: boolean) => void;
  wide: boolean;
};
