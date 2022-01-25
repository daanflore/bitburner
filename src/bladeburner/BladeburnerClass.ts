export interface BladeburnerAction {
    Type: string;
    Name: string;
    MaxSuccess: number;
    MinSuccess: number;
    NubmerActionsRemaining: number;
    Duration: number;
}