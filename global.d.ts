/**
 * "Unwrap" an array to get the type of the element of the array
 */
type Unarray<T> = T extends Array<infer U> ? U : T;
