import React, { useState } from "react";
import styled from "styled-components";
import flexBox from "@/styles/utils/flexbox";
import CommentBox from "@/components/result/CommentBox";
import ResultBox from "@/components/result/ResultBox";
import MbtiButton from "@/components/result/MbtiButton";
import { CommonButton } from "@/components/common/Button";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { getResponse } from "@/apis/getResponse";
import useCookie from "@/hooks/useCookie";
import { CommentSearchResponse, MbtiSearchResponse } from "@/types/response";
import { useRouter } from "next/router";
import axios from "axios";

//SSR로 MBTI데이터, comment데이터 조회
export const getStaticPaths = async () => {
    const { cookie } = useCookie();
    const userid = cookie.userid.toString();
    const paths = [{ params: { id: userid } }];

    return { paths, fallback: false };
};
export const getStaticProps: GetStaticProps = async () => {
    const { cookie } = useCookie();
    const userId = cookie.userid;
    const mbtiResponse = await getResponse(userId)
        .then((res) => res.data)
        .catch((error) => console.log(error));
    const mbtiData = mbtiResponse;
    const commentResponse = await axios
        .all([
            getResponse(userId, mbtiData.ei),
            getResponse(userId, mbtiData.ns),
            getResponse(userId, mbtiData.tf),
            getResponse(userId, mbtiData.pj),
        ])
        .then(
            axios.spread((ei, ns, tf, pj) => {
                const resArray = ei.data.concat(ns.data, tf.data, pj.data);
                return resArray;
            }),
        );

    return {
        props: { mbtiResponse, commentResponse, userId },
        revalidate: 1,
    };
};
//https://api.mbti-lens.youthwelfare.kr/;

const Index = ({
    mbtiResponse,
    commentResponse,
    userId,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter();

    const [mbtiState, setMbtiState] = useState<number>(0);
    const [comments, setComments] =
        useState<CommentSearchResponse>(commentResponse);
    //mbti구하기
    const mbtiData: MbtiSearchResponse = mbtiResponse;
    const mbtiLetter = [mbtiData.ei, mbtiData.ns, mbtiData.tf, mbtiData.pj].map(
        (e) => e.toUpperCase(),
    );
    //const { data, error, isLoading } = useGetComment(userid, mbtiid);
    //console.log(data, error, isLoading);

    //const commentData = commentResponse;
    return (
        <Container>
            {mbtiState === 5 ? (
                <Title>남이 보는 김철수님의 MBTI는?</Title>
            ) : null}
            <MbtiButton
                mbtiLetter={mbtiLetter}
                setState={setMbtiState}
                state={mbtiState}
            />
            {mbtiState === 5 ? (
                <ResultBox
                    mbti={mbtiLetter}
                    data={mbtiData}
                    comment={comments}
                />
            ) : (
                <CommentSection>
                    <CommentBox
                        data={comments}
                        mbtistate={mbtiLetter[mbtiState]}
                    />
                    <CommonButton
                        disabled={false}
                        content={"결과보기"}
                        onClick={() => setMbtiState(5)}
                    />
                </CommentSection>
            )}
        </Container>
    );
};

export default Index;
const Container = styled.div`
    ${flexBox("column", "center", "center;")}
    width: 100%;
    min-height: 100vh;
    height: auto;
    background: #f0e4d8;
`;
const Title = styled.h1`
    font-size: ${({ theme }) => theme.typography.xl};
    line-height: ${({ theme }) => theme.typography.x2l};
    font-family: "HSYuji", sans-serif;
    margin-bottom: 50px;
    font-weight: 500;
    width: 350px;
    color: #a06868;
    text-align: center;
    margin: 0px;
`;
const CommentSection = styled.div`
    ${flexBox("column", "center", "center;")}
    width: 100%;
    margin-bottom: 20px;
`;