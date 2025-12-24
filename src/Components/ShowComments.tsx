import React from "react";
import Swal from "sweetalert2";
import { useCommentsQuery } from "../Query/CommentsQuery";
import { useUserContext } from "../Context/UserContext";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  Skeleton,
  Alert,
} from "@mui/material";

type Props = { id: number };

type CommentItem = {
  id: number;
  ticket_id: number;
  author_id: number;
  content: string;
  author_name: string;
  author_email: string;
  created_at: string;
};

const MAIN_GRADIENT =
  "linear-gradient(135deg, rgba(25,118,210,1) 0%, rgba(156,39,176,0.95) 100%)";

// “צד שני” – אותו סטייל, אבל כחול יותר ובהיר (לא אפור)
const SOFT_BLUE =
"linear-gradient(135deg, rgba(25,118,210,0.06) 0%, rgba(156,39,176,0.05) 100%)"
export const ShowComments: React.FC<Props> = ({ id }) => {
  const commentsQ = useCommentsQuery(id);
  const { user } = useUserContext();

  const items: CommentItem[] = (commentsQ.data ?? []) as CommentItem[];

  // ✅ זה מה שצריך כדי לדעת "מי כתב"
  const myId = (user as any)?.userDetails?.id as number | undefined;

  React.useEffect(() => {
    if (!commentsQ.error) return;

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text:
        commentsQ.error instanceof Error
          ? commentsQ.error.message
          : "Failed to load comments.",
    });
  }, [commentsQ.error]);

  if (commentsQ.isLoading) {
    return (
      <Stack spacing={1.5} sx={{ mt: 1 }}>
        {[1, 2, 3].map((i) => (
          <Stack
            key={i}
            direction="row"
            justifyContent={i % 2 === 0 ? "flex-end" : "flex-start"}
            spacing={1.2}
            alignItems="flex-end"
          >
            <Skeleton variant="circular" width={34} height={34} />
            <Skeleton variant="rounded" width={280} height={44} />
          </Stack>
        ))}
      </Stack>
    );
  }

  if (commentsQ.isError) {
    return (
      <Alert severity="error" sx={{ mt: 1, borderRadius: 3 }}>
        Failed to load comments.
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        mt: 2,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        p: { xs: 1.5, md: 2 },
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={1.6} sx={{ maxHeight: 420, overflowY: "auto", pr: 0.5 }}>
        {items.map((c) => {
          const isMine = myId != null && c.author_id === myId;
          const side: "left" | "right" = isMine ? "left" : "right";

          const initials = (c.author_name?.trim()?.[0] || "U").toUpperCase();

          const bubbleSx = isMine
            ? {
                backgroundImage: SOFT_BLUE,
                color: "text.primary",
                border: "1px solid rgba(25,118,210,0.18)",
              }
            : {
                backgroundImage: SOFT_BLUE,
                color: "text.primary",
                border: "1px solid rgba(25,118,210,0.18)",
              };

          const avatarSx = isMine
            ? {
                backgroundImage: MAIN_GRADIENT,
                color: "#fff",
              }
            : {
                backgroundImage:
                  "linear-gradient(135deg, rgba(25,118,210,0.75) 0%, rgba(25,118,210,0.55) 55%, rgba(156,39,176,0.45) 100%)",
                color: "#fff",
              };

          return (
            <Stack key={c.id} spacing={0.55}>
              {/* meta */}
              <Stack
                direction="row"
                justifyContent={side === "right" ? "flex-end" : "flex-start"}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 900, color: "text.secondary" }}
                >
                  {c.author_name}{" "}
                  <Box component="span" sx={{ fontWeight: 700, opacity: 0.85 }}>
                    {new Date(c.created_at).toLocaleString()}
                  </Box>
                </Typography>
              </Stack>

              {/* row */}
              <Stack
                direction="row"
                spacing={1.1}
                justifyContent={side === "right" ? "flex-end" : "flex-start"}
                alignItems="flex-end"
              >
                {side === "left" && (
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      fontSize: 13,
                      fontWeight: 900,
                      ...avatarSx,
                    }}
                  >
                    {initials}
                  </Avatar>
                )}

                <Box
                  sx={{
                    display: "inline-flex",
                    width: "fit-content",
                    minWidth: 72,
                    maxWidth: { xs: "86%", sm: "70%" },
                    px: 2.2,
                    py: 1.2,
                    borderRadius: "9999px",
                    borderTopLeftRadius: side === "right" ? "9999px" : 16,
                    borderTopRightRadius: side === "right" ? 16 : "9999px",
                    ...bubbleSx,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: -0.15,
                      lineHeight: 1.55,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      textAlign: "start",
                    }}
                  >
                    {c.content}
                  </Typography>
                </Box>

                {side === "right" && (
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      fontSize: 13,
                      fontWeight: 900,
                      ...avatarSx,
                    }}
                  >
                    {initials}
                  </Avatar>
                )}
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ShowComments;
