interface GeneralResponse {
    statusCode: number;
    message: string;
}

// type APIResponseType = {
//     SearchResponse: GeneralResponse<{
//         _id: number;
//         user_id: number;
//         ei: "e" | "i" | null;
//         ns: "n" | "s" | null;
//         tf: "t" | "f" | null;
//         pj: "p" | "j" | null;
//         ei_like: number;
//         ns_like: number;
//         tf_like: number;
//         pj_like: number;
//     }>;
//     SubmitResponse: GeneralResponse;
// };

interface SearchResponse extends GeneralResponse {
    data: {
        _id: number;
        user_id: number;
        ei: "e" | "i" | " ";
        ns: "n" | "s" | " ";
        tf: "t" | "f" | " ";
        pj: "p" | "j" | " ";
        ei_like: number;
        ns_like: number;
        tf_like: number;
        pj_like: number;
    };
}

export interface SearchCommentResponse extends GeneralResponse {
    data: (
        | {
              _id: number;
              host_id: number;
              mbti: string;
              like: boolean;
              comment?: undefined;
          }
        | {
              _id: number;
              host_id: number;
              mbti: string;
              like: boolean;
              comment: string;
          }
    )[];
}

export default SearchResponse;
