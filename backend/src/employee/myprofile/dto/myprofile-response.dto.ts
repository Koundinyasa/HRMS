export class FieldDto {
  label!: string;
  value!: any;
}

export class RecordDto {
  fields!: FieldDto[];
}

export class AddressRecordDto {
  heading!: string;
  fields!: FieldDto[];
}

export class ProfileSectionDto {
  title!: string;
  icon!: string;
  fields?: FieldDto[];
  records?: RecordDto[] | AddressRecordDto[];
}

export class MyProfileResponseDto {
  sections!: ProfileSectionDto[];
}
