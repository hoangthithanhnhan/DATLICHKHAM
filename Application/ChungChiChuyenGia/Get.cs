using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ChungChiChuyenGia
{
    public class Get
    {
        public class  Query: IRequest<Result<DLK_ChungChiChuyenGia>>
        {
            public Guid MaChungChi;
        }
        public class Handler : IRequestHandler<Query, Result<DLK_ChungChiChuyenGia>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_ChungChiChuyenGia>> Handle(Query request, CancellationToken cancellationToken)
            {
                using(var connection=new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaChungChi", request.MaChungChi);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_ChungChiChuyenGia>("SP_Get_ChungChiChuyenGia", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_ChungChiChuyenGia>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_ChungChiChuyenGia>.Failure(ex.Message);
                    }
                    finally
                    {
                        await connection.CloseAsync();
                    }
                }
            }
        }
    }
}
