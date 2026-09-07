export class ClassificationItemDto {
    label!: string;
    employeeCount!: number;
    colorHex!: string;
    colorHexLight!: string;
}

export class ClassificationWiseCountDto {
    classificationId!: number;
    data!: ClassificationItemDto[];
}